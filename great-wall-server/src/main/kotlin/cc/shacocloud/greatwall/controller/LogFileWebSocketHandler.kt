package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.config.web.websocket.WebsocketMapping
import cc.shacocloud.greatwall.controller.exception.ForbiddenException
import cc.shacocloud.greatwall.controller.exception.UnauthorizedException
import cc.shacocloud.greatwall.controller.interceptor.AuthenticationInterceptor
import cc.shacocloud.greatwall.controller.interceptor.UserAuthRoleEnum
import cc.shacocloud.greatwall.model.dto.convert.LogTypeEnum
import cc.shacocloud.greatwall.model.dto.input.LogFileMsgInput
import cc.shacocloud.greatwall.model.dto.output.LogFileMsgutput
import cc.shacocloud.greatwall.service.SessionService
import cc.shacocloud.greatwall.utils.*
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import kotlinx.coroutines.asCoroutineDispatcher
import kotlinx.coroutines.delay
import kotlinx.coroutines.isActive
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.reactor.flux
import kotlinx.coroutines.reactor.mono
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.reactivestreams.Publisher
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.DisposableBean
import org.springframework.web.reactive.socket.CloseStatus
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.socket.WebSocketMessage
import org.springframework.web.reactive.socket.WebSocketSession
import org.springframework.web.util.UriTemplate
import reactor.core.publisher.Mono
import java.io.Closeable
import java.io.File
import java.io.FileNotFoundException
import java.io.RandomAccessFile
import java.nio.charset.StandardCharsets
import java.nio.file.Paths
import java.time.Instant
import java.time.LocalDateTime
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.Executors
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.locks.ReentrantLock
import kotlin.io.path.exists
import kotlin.io.path.invariantSeparatorsPathString


/**
 * 处理日志文件
 *
 * @author 思追(shaco)
 */
@Slf4j
@WebsocketMapping(LogFileWebSocketHandler.PATH)
class LogFileWebSocketHandler(
    private val sessionService: SessionService,
    private val authenticationInterceptor: AuthenticationInterceptor,
) : WebSocketHandler, DisposableBean {

    companion object {

        const val PATH = "/api/logs/type/{type}/name/{name}"

        // 心跳指令
        const val PING: String = "PING"
        const val PONG: String = "PONG"

        // 心跳检查时间间隔，单位秒
        const val HEARTBEAT_CHECK_INTERVAL: Int = 15

        // 心跳检查超时次数
        const val HEARTBEAT_CHECK_TIMEOUT_NUMBER: Int = 3
    }

    private val logger = LoggerFactory.getLogger(LogFileWebSocketHandler::class.java)
    private val pathTemplate = UriTemplate(PATH)
    private val sessionMappingHeartbeatCheckTaskId = ConcurrentHashMap<String, HeartbeatObj>()
    private val heartbeatCheckTimer = TaskTimer()
    private val logSenderDispatcher = Executors.newCachedThreadPool().asCoroutineDispatcher()

    override fun handle(session: WebSocketSession): Mono<Void> {
        // 解析参数
        val (type, name) = parsePathVariable(session)
        sessionMappingHeartbeatCheckTaskId.iterator()
        if (logger.isDebugEnabled) {
            logger.debug("收到日志文件链接： {} - {}", type, name)
        }

        // 认证
        val authMono = mono {

            try {
                authenticationInterceptor.auth(
                    needAuthRole = UserAuthRoleEnum.ADMIN,
                    currentSession = sessionService.currentSession(session)
                )

                if (logger.isDebugEnabled) {
                    logger.debug("日志文件链接，认证成功： {} - {}", type, name)
                }
            } catch (e: UnauthorizedException) {
                if (logger.isDebugEnabled) {
                    logger.debug("日志文件链接断开，当前用户未登录： {} - {}", type, name, e)
                }
                session.close(CloseStatus.PROTOCOL_ERROR).awaitSingleOrNull()
                throw e
            } catch (e: ForbiddenException) {
                if (logger.isDebugEnabled) {
                    logger.debug("日志文件链接断开，当前用户无访问权限： {} - {}", type, name, e)
                }
                session.close(CloseStatus.PROTOCOL_ERROR).awaitSingleOrNull()
                throw e
            } catch (e: Exception) {
                if (logger.isDebugEnabled) {
                    logger.debug("日志文件链接断开，用户认证发生例外： {} - {}", type, name, e)
                }
                session.close(CloseStatus.SERVER_ERROR).awaitSingleOrNull()
                throw e
            }
        }

        // 接受消息
        val input = session.receive()
            .map(WebSocketMessage::getPayloadAsText)
            .map { message ->

                refreshHeartbeatCheck(session)

                if (logger.isDebugEnabled) {
                    logger.debug("收到消息： {}", message)
                }

                if (message == PONG) {
                    // 忽略心跳消息
                } else {
                    val input = Json.decodeFromString<LogFileMsgInput>(message)
                    session.attributes["autoRefresh"] = input.autoRefresh
                }

            }
            .then()

        // 输出消息
        val output = session.send(subscribeMessage(session))

        return authMono.flatMap { Mono.zip(input, output) }
            .then()
            .doOnError {
                if (logger.isDebugEnabled) {
                    logger.debug("日志文件链接发生错误： {} - {}", type, name, it)
                }
            }
            .doFinally {
                closeHeartbeatCheck(session)

                if (logger.isDebugEnabled) {
                    logger.debug("日志文件链接断开： {} - {}", type, name)
                }
            }

    }

    /**
     * 订阅消息
     */
    private fun subscribeMessage(session: WebSocketSession): Publisher<WebSocketMessage> =
        flux<WebSocketMessage>(logSenderDispatcher) {

            val (type, name) = parsePathVariable(session)

            val logFile =
                Paths.get(LogsController.rootDir.invariantSeparatorsPathString, type.dirName, name)
            if (!logFile.exists()) {
                if (logger.isWarnEnabled) {
                    logger.warn("日志文件不存在：{}", session.handshakeInfo.uri)
                }
                throw FileNotFoundException()
            }

            LogFileReader(logFile.toFile()).use {

                // 使用分批发送，批次为 1 秒或达到100条消息
                val batchTime = 1.seconds
                val batchCount = 100

                var start: Instant? = null
                var batchLog: MutableList<String> = ArrayList(batchCount)

                // 发送消息
                val sendBatchLog = suspend {
                    if (batchLog.isNotEmpty()) {
                        send(session.textMessage(Json.encodeToString(batchLog)))
                        batchLog = ArrayList(batchCount)
                        start = null
                    }
                }

                while (session.isOpen && isActive) {
                    val autoRefresh = session.attributes["autoRefresh"] as Boolean?

                    if (autoRefresh != null && !autoRefresh) {
                        // 切换到自动重试时，先发送消息
                        sendBatchLog()

                        delay(1000)
                        continue
                    }

                    // 开始时间为空则开始
                    start = start ?: Instant.now()

                    // 读取一行数据
                    val result = it.readTaskLogPage() ?: continue

                    val (lastLine, line) = result
                    if (line != null) {
                        batchLog.add(line)
                    }

                    // 计算是否满足批次
                    val finalStart = start
                    if (batchLog.size >= batchCount
                        || (finalStart != null && (Instant.now() - finalStart) >= batchTime)
                    ) {
                        sendBatchLog()
                    }

                    // 到达尾行睡眠1秒
                    if (lastLine) {
                        // 发送批次消息
                        sendBatchLog()

                        delay(1000)
                    }
                }
            }
        }


    /**
     * 刷新心跳检查
     */
    private fun refreshHeartbeatCheck(session: WebSocketSession) {
        val heartbeatObj = sessionMappingHeartbeatCheckTaskId[session.id]

        val checkExecuteTime = (LocalDateTime.now() + HEARTBEAT_CHECK_INTERVAL.seconds).toEpochMilli()
        val heartbeatCheckTask = HeartbeatCheckTask(session)

        val timeoutExecuteTime =
            (LocalDateTime.now() + (HEARTBEAT_CHECK_INTERVAL * HEARTBEAT_CHECK_TIMEOUT_NUMBER).seconds).toEpochMilli()
        val heartbeatTimeoutTask = HeartbeatTimeoutTask(session)

        if (heartbeatObj == null) {
            val checkTaskId = heartbeatCheckTimer.saveTask(checkExecuteTime, heartbeatCheckTask)
            val timeoutId = heartbeatCheckTimer.saveTask(timeoutExecuteTime, heartbeatTimeoutTask)
            sessionMappingHeartbeatCheckTaskId[session.id] = HeartbeatObj(checkTaskId, timeoutId)
        } else {
            heartbeatCheckTimer.saveTask(heartbeatObj.checkTaskId, checkExecuteTime, heartbeatCheckTask)
            heartbeatCheckTimer.saveTask(heartbeatObj.timeoutTaskId, timeoutExecuteTime, heartbeatTimeoutTask)
        }
    }

    /**
     * 关闭心跳检查
     */
    private fun closeHeartbeatCheck(session: WebSocketSession) {
        val heartbeatObj = sessionMappingHeartbeatCheckTaskId.remove(session.id)

        if (heartbeatObj != null) {
            heartbeatCheckTimer.removeTask(heartbeatObj.checkTaskId)
            heartbeatCheckTimer.removeTask(heartbeatObj.timeoutTaskId)
        }
    }


    override fun destroy() {
        try {
            logSenderDispatcher.close()
        } catch (e: Exception) {
            if (logger.isWarnEnabled) {
                logger.warn("关闭日志发送队列发生错误！", e)
            }
        }

        try {
            heartbeatCheckTimer.shutdown()
        } catch (e: InterruptedException) {
            if (logger.isWarnEnabled) {
                logger.warn("关闭心跳检查定时器发生错误！", e)
            }
        }
    }


    // ----------------


    /**
     * 解析路径变量
     */
    fun parsePathVariable(session: WebSocketSession): PathVariable {
        val handshakeInfo = session.handshakeInfo
        val pathVariable = pathTemplate.match(handshakeInfo.uri.path)

        return PathVariable(
            type = LogTypeEnum.valueOf(pathVariable["type"]!!.uppercase()),
            name = pathVariable["name"]!!
        )
    }

    data class HeartbeatObj(
        val checkTaskId: String,
        val timeoutTaskId: String
    )

    data class PathVariable(
        val type: LogTypeEnum,
        val name: String,
    )

    /**
     * 日志文件读取器，内部使用[RandomAccessFile] 作为底层访问对象
     */
    class LogFileReader(file: File) : Closeable {

        private val randomAccessFile: RandomAccessFile = RandomAccessFile(file, "r")
        private val isClose = AtomicBoolean(false)
        private val lock = ReentrantLock()

        /**
         * 读取任务日志页内容
         *
         * @return 如果返回 null 则表示存在并发，请忽略该内容
         */
        fun readTaskLogPage(): LogFileMsgutput? {
            if (isClose()) {
                throw IllegalStateException("日志文件读取器已经关闭！")
            }

            if (!lock.tryLock()) {
                return null
            }

            try {
                // 读取对应行数的数据
                val line = nextLine()
                val result = if (line.isNotEmpty()) {
                    LogFileMsgutput(
                        lastLine = isLastLine,
                        line = line
                    )
                } else {
                    val filePointer = randomAccessFile.filePointer
                    val length = randomAccessFile.length()

                    // 到达尾行
                    if (filePointer >= length) {
                        LogFileMsgutput(
                            lastLine = true,
                        )
                    } else {
                        LogFileMsgutput(
                            lastLine = isLastLine,
                        )
                    }
                }

                return result
            } finally {
                lock.unlock()
            }
        }

        /**
         * 当前是否到达尾行，返回 true 表示达到尾行
         */
        private val isLastLine: Boolean
            get() {
                val filePointer = randomAccessFile.filePointer
                try {
                    val line = nextLine()
                    if (line.isNotEmpty()) {
                        val length = randomAccessFile.length()
                        return filePointer >= length
                    }
                    return false
                } finally {
                    randomAccessFile.seek(filePointer)
                }
            }

        /**
         * 从指定坐标读取一行
         */
        private fun nextLine(): String {
            var input = StringBuilder()

            val filePointer = randomAccessFile.filePointer
            try {
                while (true) {
                    // 指针到达结尾缺未遇到换行符说明当前行未写完，指针回到起始位置
                    if (randomAccessFile.filePointer >= randomAccessFile.length()) {
                        randomAccessFile.seek(filePointer)
                        input = StringBuilder()
                        break
                    }

                    val c = randomAccessFile.read()
                    if (c == '\n'.code) {
                        break
                    } else if (c == '\r'.code) {
                        val cur = randomAccessFile.filePointer
                        if ((randomAccessFile.read()) != '\n'.code) {
                            randomAccessFile.seek(cur)
                        }
                        break
                    } else {
                        input.append(c.toChar())
                    }
                }

                return String(input.toString().toByteArray(StandardCharsets.ISO_8859_1), StandardCharsets.UTF_8)
            } catch (e: Exception) {
                randomAccessFile.seek(filePointer)
                throw e
            }
        }

        override fun close() {
            if (!isClose.getAndSet(true)) {
                randomAccessFile.close()
            }
        }

        /**
         * 是否已经关闭
         */
        fun isClose(): Boolean {
            return isClose.get()
        }
    }

    /**
     * 心跳检查任务
     */
    @Slf4j
    class HeartbeatCheckTask(private val session: WebSocketSession) : Runnable {

        override fun run() = runBlocking {
            try {
                if (session.isOpen) {
                    if (log.isDebugEnabled) {
                        log.debug("{}-{} 心跳发送心跳消息：{}", session.id, session.handshakeInfo.uri, PING)
                    }

                    session.send(Mono.just(session.textMessage(PING))).awaitSingleOrNull()
                }
            } catch (e: java.lang.Exception) {
                if (log.isWarnEnabled) {
                    log.warn("心跳检查发送例外！", e)
                }
            }
        }
    }


    /**
     * 心跳超时任务
     */
    @Slf4j
    class HeartbeatTimeoutTask(private val session: WebSocketSession) : Runnable {

        override fun run() = runBlocking {
            try {
                if (session.isOpen) {
                    if (log.isDebugEnabled) {
                        log.debug("{}-{} 心跳超时关闭会话", session.id, session.handshakeInfo.uri)
                    }

                    session.close().awaitSingleOrNull()
                }
            } catch (e: java.lang.Exception) {
                if (log.isWarnEnabled) {
                    log.warn("心跳超时关闭会话发生例外！", e)
                }
            }
        }
    }
}

package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.config.web.websocket.WSHandler
import cc.shacocloud.greatwall.controller.exception.ForbiddenException
import cc.shacocloud.greatwall.controller.exception.UnauthorizedException
import cc.shacocloud.greatwall.controller.interceptor.AuthenticationInterceptor
import cc.shacocloud.greatwall.controller.interceptor.UserAuthRoleEnum
import cc.shacocloud.greatwall.model.dto.convert.LogEnum
import cc.shacocloud.greatwall.model.dto.input.LogFilePageInput
import cc.shacocloud.greatwall.model.dto.output.LogFilePageOutput
import cc.shacocloud.greatwall.service.SessionService
import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import cc.shacocloud.greatwall.utils.TaskTimer
import cc.shacocloud.greatwall.utils.seconds
import cc.shacocloud.greatwall.utils.toEpochMilli
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.reactor.mono
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.springframework.beans.factory.DisposableBean
import org.springframework.web.reactive.socket.CloseStatus
import org.springframework.web.reactive.socket.WebSocketHandler
import org.springframework.web.reactive.socket.WebSocketSession
import org.springframework.web.util.UriTemplate
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.io.Closeable
import java.io.File
import java.io.RandomAccessFile
import java.nio.charset.StandardCharsets
import java.nio.file.Paths
import java.time.LocalDateTime
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.atomic.AtomicBoolean
import kotlin.io.path.exists
import kotlin.io.path.invariantSeparatorsPathString


/**
 * 处理日志文件
 *
 * @author 思追(shaco)
 */
@Slf4j
@WSHandler(LogFileWebSocketHandler.PATH)
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

    private val pathTemplate = UriTemplate(PATH)
    private val sessionMappingHeartbeatCheckTaskId = ConcurrentHashMap<String, HeartbeatObj>()
    private val heartbeatCheckTimer = TaskTimer()

    override fun handle(session: WebSocketSession): Mono<Void> = mono {

        // 认证
        try {
            authenticationInterceptor.auth(
                needAuthRole = UserAuthRoleEnum.ADMIN,
                currentSession = sessionService.currentSession(session)
            )
        } catch (e: UnauthorizedException) {
            e.printStackTrace()
            return@mono session.close(CloseStatus.PROTOCOL_ERROR).awaitSingleOrNull()
        } catch (e: ForbiddenException) {
            e.printStackTrace()
            return@mono session.close(CloseStatus.PROTOCOL_ERROR).awaitSingleOrNull()
        } catch (e: Exception) {
            e.printStackTrace()
            return@mono session.close(CloseStatus.SERVER_ERROR).awaitSingleOrNull()
        }


        // 解析参数
        val (type, name) = try {
            parsePathVariable(session)
        } catch (ex: Throwable) {
            return@mono session.close(CloseStatus.BAD_DATA).awaitSingleOrNull()
        }

        val logFile = Paths.get(LogsController.rootDir.invariantSeparatorsPathString, type.dirName, name)
        if (!logFile.exists()) {
            return@mono session.close(CloseStatus.SERVER_ERROR).awaitSingleOrNull()
        }

        // 打开日志文件
        val logFileReader = LogFileReader(logFile.toFile())

        session.receive()
            .flatMap {
                refreshHeartbeatCheck(session)

                val input = Json.decodeFromString<LogFilePageInput>(it.payloadAsText)
                val result = logFileReader.readTaskLogPage(input)

                val message = session.textMessage(Json.encodeToString(result))
                session.send(Flux.just(message))
            }
            .then()
            .doOnError {
                if (log.isErrorEnabled) {
                    log.error("日志websocket会话异常，链接关闭，异常信息：{}", it.message, it)
                }

                try {
                    if (session.isOpen) {
                        runBlocking {
                            session.close(CloseStatus.SERVER_ERROR).awaitSingleOrNull()
                        }
                    }
                } catch (e: Exception) {
                    log.warn("关闭websocket会话发生例外！", e)
                }
            }
            .doFinally {
                closeHeartbeatCheck(session)
                logFileReader.close()
            }
            .awaitSingleOrNull()
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
            heartbeatCheckTimer.shutdown()
        } catch (e: InterruptedException) {
            if (log.isWarnEnabled) {
                log.warn("关闭心跳检查定时器发生错误！", e)
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
            type = LogEnum.valueOf(pathVariable["type"]!!),
            name = pathVariable["name"]!!
        )
    }

    data class HeartbeatObj(
        val checkTaskId: String,
        val timeoutTaskId: String
    )

    data class PathVariable(
        val type: LogEnum,
        val name: String,
    )

    /**
     * 日志文件读取器，内部使用[RandomAccessFile] 作为底层访问对象
     */
    class LogFileReader(file: File) : Closeable {

        private val randomAccessFile: RandomAccessFile = RandomAccessFile(file, "r")
        private val isClose = AtomicBoolean(false)

        /**
         * 读取任务日志页内容
         */
        fun readTaskLogPage(input: LogFilePageInput): LogFilePageOutput {
            if (isClose.get()) {
                return LogFilePageOutput.EMPTY
            }

            // 读取对应行数的数据
            val lineNumber: Int = input.lineNumber
            val logData: MutableList<String> = ArrayList(lineNumber)
            for (i in 0 until lineNumber) {
                val line = nextLine()
                if (line.isNotEmpty()) {
                    logData.add(line)
                } else {
                    val filePointer = randomAccessFile.filePointer
                    val length = randomAccessFile.length()
                    // 到达尾行
                    if (filePointer >= length) {
                        break
                    } else {
                        logData.add("")
                    }
                }
            }

            // 封装结果
            return LogFilePageOutput(
                lastLine = isLastLine,
                lineNumber = logData.size,
                lineData = logData
            )
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
        fun nextLine(): String {
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

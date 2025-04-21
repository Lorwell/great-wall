package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.controller.interceptor.UserAuth
import cc.shacocloud.greatwall.model.constant.LogTypeEnum
import cc.shacocloud.greatwall.model.dto.output.LogListOutput
import org.springframework.core.io.buffer.DataBufferUtils
import org.springframework.core.io.buffer.DefaultDataBufferFactory
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import reactor.core.publisher.Mono
import java.io.File
import java.nio.file.Files
import java.nio.file.Path
import java.nio.file.Paths
import kotlin.io.path.extension
import kotlin.io.path.invariantSeparatorsPathString
import kotlin.io.path.isDirectory

/**
 * 日志控制器
 * @author 思追(shaco)
 */
@UserAuth
@Validated
@RestController
@RequestMapping("/api/logs")
class LogsController {

    companion object {

        /**
         * 日志文件根路径
         */
        val rootDir: Path by lazy {
            File("./data/logs").toPath().toAbsolutePath().normalize()
        }

    }

    @GetMapping
    suspend fun list(
        @RequestParam(required = false) type: LogTypeEnum? = null,
    ): List<LogListOutput> {
        return LogTypeEnum.entries
            .filter { type == null || it == type }
            .flatMap { rootDir.toLogList(it) }
            .sortedByDescending { it.lastUpdateTime }
    }

    /**
     * 下载日志文件
     */
    @GetMapping("/type/{type}/name/{name}/download")
    fun download(
        @PathVariable type: LogTypeEnum,
        @PathVariable name: String,
        response: ServerHttpResponse,
    ): Mono<Void> {
        val logFile = Paths.get(rootDir.invariantSeparatorsPathString, type.dirName, name)
        if (Files.exists(logFile)) {

            // 设置响应类型
            response.headers.contentType = MediaType.TEXT_PLAIN

            val dataBufferFlux = DataBufferUtils.read(logFile, DefaultDataBufferFactory(), 1024)
            return response.writeWith(dataBufferFlux)
        }

        response.setStatusCode(HttpStatus.NOT_FOUND)
        return response.setComplete()
    }


    // ----------

    fun Path.toLogList(
        type: LogTypeEnum,
    ): List<LogListOutput> {
        return Files.list(Paths.get(invariantSeparatorsPathString, type.dirName))
            .filter { !it.isDirectory() && it.extension == "log" }
            .map { LogListOutput(type, it) }
            .toList()
    }

}
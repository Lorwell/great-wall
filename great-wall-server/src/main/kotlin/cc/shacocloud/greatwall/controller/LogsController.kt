package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.controller.interceptor.UserAuth
import cc.shacocloud.greatwall.model.dto.convert.LogEnum
import cc.shacocloud.greatwall.model.dto.output.LogListOutput
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
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
    fun list(): List<LogListOutput> {
        val rootLogFiles = rootDir.toLogList(LogEnum.ROOT)
        val accessLogFiles = rootDir.toLogList(LogEnum.ACCESS)

        return (rootLogFiles + accessLogFiles).sortedByDescending { it.lastUpdateTime }
    }


    // ----------

    fun Path.toLogList(
        type: LogEnum
    ): List<LogListOutput> {
        return Files.list(Paths.get(invariantSeparatorsPathString, type.dirName))
            .filter { !it.isDirectory() && it.extension == "log" }
            .map { LogListOutput(type, it) }
            .toList()
    }

}
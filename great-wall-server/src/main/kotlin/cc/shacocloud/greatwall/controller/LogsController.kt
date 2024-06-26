package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.model.dto.output.LogListOutput
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import java.io.File

/**
 * 日志控制器
 * @author 思追(shaco)
 */
//@UserAuth
@Validated
@RestController
@RequestMapping("/api/logs")
class LogsController {

    @GetMapping
    fun list(): List<LogListOutput> {
        val logPath = File("./data/logs")

        val rootFile = File(logPath, "root")
        val rootLogFiles = rootFile
            .list { _: File, name: String -> name.endsWith(".log") }
            ?.map { File(rootFile, it) }
            ?: emptyList()

        val accessFile = File(logPath, "access_log")
        val accessLogFiles = accessFile
            .list { _: File, name: String -> name.endsWith(".log") }
            ?.map { File(rootFile, it) }
            ?: emptyList()

        val logFiles = (rootLogFiles + accessLogFiles)

        println(logFiles)
        return emptyList()
    }

}
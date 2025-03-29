package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.controller.interceptor.UserAuth
import cc.shacocloud.greatwall.model.dto.input.TlsInput
import cc.shacocloud.greatwall.model.dto.output.TlsOutput
import cc.shacocloud.greatwall.model.dto.output.TlsOutput.Companion.toOutput
import cc.shacocloud.greatwall.service.TlsService
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.core.io.buffer.DataBufferUtils
import org.springframework.core.io.buffer.DefaultDataBufferFactory
import org.springframework.http.MediaType
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.stereotype.Controller
import org.springframework.transaction.annotation.Transactional
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import kotlin.io.path.createTempFile
import kotlin.io.path.deleteExisting


/**
 * 证书管理控制器
 *
 * @author 思追(shaco)
 */
@UserAuth
@Validated
@Controller
@RequestMapping("/api/tls")
@Transactional(rollbackFor = [Exception::class])
class TlsController(
    val tlsService: TlsService,
) {

    /**
     * 更新
     */
    @PutMapping
    @ResponseBody
    suspend fun update(@RequestBody @Validated input: TlsInput): TlsOutput {
        return tlsService.update(input).toOutput()
    }

    /**
     * 证书详情
     */
    @GetMapping
    @ResponseBody
    suspend fun details(): TlsOutput? {
        return tlsService.findTlsPo()?.toOutput()
    }

    /**
     * 下载证书
     */
    @GetMapping("/download")
    suspend fun download(response: ServerHttpResponse) {
        val tempFile = createTempFile(prefix = "tls")

        try {
            tlsService.genZipFile(tempFile)

            // 设置响应类型
            response.headers.contentType = MediaType.valueOf("application/x-zip-compressed")

            // 写出文件
            val dataBufferFlux = DataBufferUtils.read(
                tempFile, DefaultDataBufferFactory(), 1024
            )
            response.writeWith(dataBufferFlux).awaitSingleOrNull()
        } finally {
            tempFile.deleteExisting()
        }
    }

    /**
     * 移除证书
     */
    @DeleteMapping
    @ResponseBody
    suspend fun delete() {
        return tlsService.delete()
    }

}
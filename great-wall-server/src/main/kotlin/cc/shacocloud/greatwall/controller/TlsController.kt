package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.model.dto.convert.toOutput
import cc.shacocloud.greatwall.model.dto.input.TlsInput
import cc.shacocloud.greatwall.model.dto.output.TlsOutput
import cc.shacocloud.greatwall.service.TlsService
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 * 证书管理控制器
 *
 * @author 思追(shaco)
 */
@Validated
@RestController
@RequestMapping("/api/tls")
class TlsController(
    val tlsService: TlsService
) {

    /**
     * 更新
     */
    @PutMapping
    suspend fun update(@RequestBody @Validated input: TlsInput): TlsOutput {
        return tlsService.update(input).toOutput()
    }

    /**
     * 证书详情
     */
    @GetMapping
    suspend fun details(): TlsOutput? {
        return tlsService.findTlsPo()?.toOutput()
    }

}
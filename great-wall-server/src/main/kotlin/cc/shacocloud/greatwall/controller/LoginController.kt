package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.config.AdminAuthProperties
import cc.shacocloud.greatwall.config.AdminAuthProperties.Companion.ADMIN_USER
import cc.shacocloud.greatwall.controller.interceptor.NoAuth
import cc.shacocloud.greatwall.controller.interceptor.UserAuth
import cc.shacocloud.greatwall.model.dto.input.LoginInput
import cc.shacocloud.greatwall.model.mo.AdminSessionMo
import cc.shacocloud.greatwall.service.SessionService
import org.springframework.transaction.annotation.Transactional
import org.springframework.validation.BeanPropertyBindingResult
import org.springframework.validation.BindException
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RestController
import org.springframework.web.server.ServerWebExchange
import java.util.*

/**
 * 登录控制器
 * @author 思追(shaco)
 */
@Validated
@RestController
@Transactional(rollbackFor = [Exception::class])
class LoginController(
    val adminAuthProperties: AdminAuthProperties,
    val sessionService: SessionService
) {

    /**
     * 登录接口
     */
    @NoAuth
    @PostMapping("/api/login")
    suspend fun login(
        @Validated @RequestBody input: LoginInput,
        exchange: ServerWebExchange
    ) {
        val bindingResult = BeanPropertyBindingResult(input, "input")

        if (ADMIN_USER == input.username) {
            if (adminAuthProperties.password != input.password) {
                bindingResult.rejectValue("password", "密码无效")
                throw BindException(bindingResult)
            }
            sessionService.saveSession(exchange.response, AdminSessionMo(UUID.randomUUID().toString()))
            return
        }

        bindingResult.rejectValue("username", "用户不存在")
        throw BindException(bindingResult)
    }

    /**
     * 登出
     */
    @UserAuth
    @DeleteMapping("/api/login-out")
    suspend fun loginOut(exchange: ServerWebExchange) {
        val session = sessionService.getSession(exchange)
        sessionService.removeSession(exchange.response, session)
    }


}
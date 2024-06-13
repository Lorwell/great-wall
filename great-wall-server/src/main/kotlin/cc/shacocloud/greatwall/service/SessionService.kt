package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.controller.exception.UnauthorizedException
import cc.shacocloud.greatwall.model.mo.SessionMo
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.web.server.ServerWebExchange
import kotlin.time.Duration
import kotlin.time.Duration.Companion.hours

/**
 *
 * @author 思追(shaco)
 */
interface SessionService {

    companion object {

        /**
         * session 名称
         */
        const val SESSION_NAME = "greatwall-session"

    }

    /**
     * 保存会话信息
     * @param sessionMo 用户会话信息
     * @param ttl 会话过期事件
     */
    suspend fun saveSession(
        response: ServerHttpResponse,
        sessionMo: SessionMo,
        ttl: Duration = 12.hours
    )

    /**
     * 移除会话
     */
    suspend fun removeSession(
        response: ServerHttpResponse,
        sessionMo: SessionMo
    )

    /**
     * 获取当前访问用户的会话信息
     */
    suspend fun currentSession(exchange: ServerWebExchange): SessionMo?

    /**
     * 获取当前会话，如果没有会话则抛出未登录异常
     */
    suspend fun getSession(exchange: ServerWebExchange): SessionMo {
        return currentSession(exchange) ?: throw UnauthorizedException()
    }

}
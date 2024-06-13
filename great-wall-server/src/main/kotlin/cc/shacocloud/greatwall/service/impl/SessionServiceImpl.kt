package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.model.mo.SessionMo
import cc.shacocloud.greatwall.service.SessionService
import cc.shacocloud.greatwall.service.SessionService.Companion.SESSION_NAME
import cc.shacocloud.greatwall.service.cache.CacheManager
import cc.shacocloud.greatwall.utils.Slf4j
import org.springframework.http.ResponseCookie
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.stereotype.Service
import org.springframework.web.server.ServerWebExchange
import kotlin.time.Duration
import kotlin.time.toJavaDuration

/**
 *
 * @author 思追(shaco)
 */
@Slf4j
@Service
class SessionServiceImpl(
    cacheManager: CacheManager,
) : SessionService {

    companion object {

        /**
         * 会话携带在请求中的属性键
         */
        val SESSION_ATTRIBUTE_KEY = "${SessionServiceImpl::class.java.canonicalName}.session"

    }

    val sessionCache = cacheManager.getCache("session")

    /**
     * 保存会话信息
     * @param sessionMo 用户会话信息
     * @param ttl 会话过期事件
     */
    override suspend fun saveSession(
        response: ServerHttpResponse,
        sessionMo: SessionMo,
        ttl: Duration
    ) {
        sessionCache.put(sessionMo.sessionId, sessionMo, ttl)

        // 添加 cookie
        val cookie = ResponseCookie.from(SESSION_NAME, sessionMo.sessionId)
            .path("/")
            .maxAge(ttl.toJavaDuration())
            .build()
        response.addCookie(cookie)
    }

    /**
     * 移除会话
     */
    override suspend fun removeSession(
        response: ServerHttpResponse,
        sessionMo: SessionMo
    ) {
        sessionCache.del(sessionMo.sessionId)

        // 添加立即过期的 cookie
        val cookie = ResponseCookie.from(SESSION_NAME, sessionMo.sessionId)
            .path("/")
            .maxAge(0)
            .build()
        response.addCookie(cookie)
    }

    /**
     * 获取当前访问用户的会话信息
     */
    override suspend fun currentSession(exchange: ServerWebExchange): SessionMo? {
        return exchange.attributes[SESSION_ATTRIBUTE_KEY] as SessionMo? ?: let {
            val sessionMo = exchange.request.cookies[SESSION_NAME]?.let {
                it.firstNotNullOfOrNull { cookie -> sessionCache.get<SessionMo>(cookie.value) }
            }

            if (sessionMo != null) {
                exchange.attributes[SESSION_ATTRIBUTE_KEY] = sessionMo
            }

            sessionMo
        }
    }

}
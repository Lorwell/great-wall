package cc.shacocloud.greatwall.config.web

import org.springframework.core.Ordered
import org.springframework.web.method.HandlerMethod
import org.springframework.web.reactive.HandlerResult
import org.springframework.web.server.ServerWebExchange

/**
 * 请求映射处理器拦截器
 * @see RequestMappingHandlerInterceptorAdapter
 * @author 思追(shaco)
 */
interface RequestMappingHandlerInterceptor : Ordered {

    /**
     * 在请求执行前执行
     *
     * 如果想中断执行请抛出例外
     */
    suspend fun preHandle(
        exchange: ServerWebExchange,
        handler: HandlerMethod
    ) {
    }

    /**
     * 在完成后执行执行前执行
     *
     * 该方法只在 [preHandle] 执行成功后才执行
     */
    suspend fun postHandle(
        exchange: ServerWebExchange,
        handler: HandlerMethod,
        result: HandlerResult?,
        exception: Exception?
    ) {
    }

}
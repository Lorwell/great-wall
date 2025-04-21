package cc.shacocloud.greatwall.config.web.interceptor

import org.springframework.core.Ordered
import org.springframework.web.method.HandlerMethod
import org.springframework.web.reactive.HandlerResult
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

/**
 * 请求映射处理器拦截器
 * @see RequestMappingHandlerInterceptorAdapter
 * @author 思追(shaco)
 */
interface RequestMappingHandlerInterceptor : Ordered {

    /**
     * 处理拦截器
     */
    fun handle(
        exchange: ServerWebExchange,
        handler: HandlerMethod,
        chain: RequestMappingHandlerChain,
    ): Mono<HandlerResult> {
        return chain.next(exchange, handler)
    }
}
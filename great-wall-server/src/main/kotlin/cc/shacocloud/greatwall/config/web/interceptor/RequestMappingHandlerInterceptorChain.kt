package cc.shacocloud.greatwall.config.web.interceptor

import org.springframework.web.method.HandlerMethod
import org.springframework.web.reactive.HandlerResult
import org.springframework.web.reactive.result.method.annotation.RequestMappingHandlerAdapter
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

/**
 * [RequestMappingHandlerChain] 的默认实现
 *
 * @author 思追(shaco)
 */
class RequestMappingHandlerInterceptorChain(
    private val requestMappingHandlerAdapter: RequestMappingHandlerAdapter,
    private val interceptor: RequestMappingHandlerInterceptor? = null,
    private val chain: RequestMappingHandlerInterceptorChain? = null,
) : RequestMappingHandlerChain {

    /**
     * 处理下一个 [RequestMappingHandlerInterceptor]
     */
    override fun next(exchange: ServerWebExchange, handler: HandlerMethod): Mono<HandlerResult> {
        return Mono.defer {
            if (interceptor != null && chain != null) {
                invokeFilter(interceptor, chain, exchange, handler)
            } else {
                requestMappingHandlerAdapter.handle(exchange, handler)
            }
        }
    }

    private fun invokeFilter(
        interceptor: RequestMappingHandlerInterceptor,
        chain: RequestMappingHandlerInterceptorChain,
        exchange: ServerWebExchange,
        handler: HandlerMethod,
    ): Mono<HandlerResult> {
        val currentName = interceptor.javaClass.name
        return interceptor.handle(exchange, handler, chain)
            .checkpoint("$currentName [RequestMappingHandlerInterceptorChain]")
    }


}
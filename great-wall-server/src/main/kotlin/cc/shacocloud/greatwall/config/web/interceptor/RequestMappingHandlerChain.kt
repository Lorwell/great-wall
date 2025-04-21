package cc.shacocloud.greatwall.config.web.interceptor

import org.springframework.web.method.HandlerMethod
import org.springframework.web.reactive.HandlerResult
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

/**
 * [RequestMappingHandlerInterceptor] 的请求处理链
 *
 * @author 思追(shaco)
 */
interface RequestMappingHandlerChain {

    /**
     * 处理下一个 [RequestMappingHandlerInterceptor]
     */
    fun next(exchange: ServerWebExchange, handler: HandlerMethod): Mono<HandlerResult>
}
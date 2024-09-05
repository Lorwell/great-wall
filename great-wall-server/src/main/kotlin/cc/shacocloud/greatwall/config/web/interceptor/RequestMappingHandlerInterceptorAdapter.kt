package cc.shacocloud.greatwall.config.web.interceptor

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.ObjectProvider
import org.springframework.core.Ordered
import org.springframework.core.annotation.AnnotationAwareOrderComparator
import org.springframework.stereotype.Component
import org.springframework.web.method.HandlerMethod
import org.springframework.web.reactive.DispatchExceptionHandler
import org.springframework.web.reactive.HandlerAdapter
import org.springframework.web.reactive.HandlerResult
import org.springframework.web.reactive.result.method.annotation.RequestMappingHandlerAdapter
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono
import java.util.stream.Collectors

/**
 * 基于 [RequestMappingHandlerAdapter] 实现的请求拦截器
 *
 * 利用 [Ordered] 在 [RequestMappingHandlerAdapter] 之前执行
 *
 * @author 思追(shaco)
 */
@Component
class RequestMappingHandlerInterceptorAdapter(
    private val requestMappingHandlerAdapter: RequestMappingHandlerAdapter,
    private val interceptorProvider: ObjectProvider<RequestMappingHandlerInterceptor>,
) : HandlerAdapter, DispatchExceptionHandler, Ordered {

    companion object {
        private val log: Logger = LoggerFactory.getLogger(RequestMappingHandlerInterceptorAdapter::class.java)

        /**
         * 初始化渠道
         */
        fun initChina(
            requestMappingHandlerAdapter: RequestMappingHandlerAdapter,
            interceptors: List<RequestMappingHandlerInterceptor>,
        ): RequestMappingHandlerChain {
            var chain = RequestMappingHandlerInterceptorChain(requestMappingHandlerAdapter)

            val iterator = interceptors.listIterator(interceptors.size)
            while (iterator.hasPrevious()) {
                chain = RequestMappingHandlerInterceptorChain(requestMappingHandlerAdapter, iterator.previous(), chain)
            }
            return chain
        }

    }

    // 拦截器
    private val interceptors: List<RequestMappingHandlerInterceptor>
        get() {
            val result = interceptorProvider.stream().collect(Collectors.toList())
            AnnotationAwareOrderComparator.sort(result)
            return result
        }

    private val china: RequestMappingHandlerChain = initChina(requestMappingHandlerAdapter, interceptors)

    override fun supports(handler: Any): Boolean {
        return requestMappingHandlerAdapter.supports(handler)
    }

    override fun handle(exchange: ServerWebExchange, handler: Any): Mono<HandlerResult> {
        val handlerMethod = handler as HandlerMethod
        return china.next(exchange, handlerMethod)
    }

    override fun handleError(exchange: ServerWebExchange, ex: Throwable): Mono<HandlerResult> {
        return requestMappingHandlerAdapter.handleError(exchange, ex)
    }

    override fun getOrder(): Int {
        val priority = AnnotationAwareOrderComparator.INSTANCE.getPriority(requestMappingHandlerAdapter)
        return if (priority == null) Ordered.HIGHEST_PRECEDENCE else priority - 1
    }

}

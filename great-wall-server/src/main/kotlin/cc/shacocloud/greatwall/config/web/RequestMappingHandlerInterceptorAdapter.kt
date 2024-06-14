package cc.shacocloud.greatwall.config.web

import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.reactor.mono
import org.springframework.beans.factory.ObjectProvider
import org.springframework.core.annotation.AnnotationAwareOrderComparator
import org.springframework.web.method.HandlerMethod
import org.springframework.web.reactive.HandlerAdapter
import org.springframework.web.reactive.HandlerResult
import org.springframework.web.reactive.result.method.annotation.RequestMappingHandlerAdapter
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono
import java.util.stream.Collectors

/**
 * 基于 [RequestMappingHandlerAdapter] 实现的请求拦截器
 *
 * @author 思追(shaco)
 */
@Slf4j
class RequestMappingHandlerInterceptorAdapter(
    private val requestMappingHandlerAdapter: RequestMappingHandlerAdapter,
    private val interceptorProvider: ObjectProvider<RequestMappingHandlerInterceptor>
) : HandlerAdapter {

    // 拦截器
    private val interceptors: List<RequestMappingHandlerInterceptor> by lazy {
        val result = interceptorProvider.stream().collect(Collectors.toList())
        AnnotationAwareOrderComparator.sort(result)
        result
    }

    override fun supports(handler: Any): Boolean {
        return requestMappingHandlerAdapter.supports(handler)
    }

    override fun handle(exchange: ServerWebExchange, handler: Any): Mono<HandlerResult> = mono {
        val handlerMethod = handler as HandlerMethod

        var ex: Exception? = null

        // 拦截器前置方法执行
        val currentInterceptors = ArrayList<RequestMappingHandlerInterceptor>(interceptors.size)
        for (interceptor in interceptors) {
            try {
                interceptor.preHandle(exchange, handlerMethod)
            } catch (e: Exception) {
                ex = e
                break
            }
            currentInterceptors.add(interceptor)
        }

        var ex2: Exception? = null
        var handlerResult: HandlerResult? = null
        if (ex == null) {
            // 执行实际请求
            try {
                handlerResult = requestMappingHandlerAdapter.handle(exchange, handler).awaitSingleOrNull()
            } catch (e: Exception) {
                ex2 = e
            }
        }
        // 执行错误请求
        else {
            try {
                handlerResult = requestMappingHandlerAdapter.handleError(exchange, ex).awaitSingleOrNull()
            } catch (e: Exception) {
                ex2 = e
            }
        }

        // 执行拦截器后置方法
        handlePostHandle(currentInterceptors, exchange, handlerMethod, handlerResult, ex2)

        handlerResult
    }

    /**
     * 执行后置方法
     */
    suspend fun handlePostHandle(
        interceptors: List<RequestMappingHandlerInterceptor>,
        exchange: ServerWebExchange,
        handler: HandlerMethod,
        result: HandlerResult?,
        exception: Exception?
    ) {
        for (it in interceptors) {
            try {
                it.postHandle(exchange, handler, result, exception)
            } catch (e: Exception) {
                if (log.isWarnEnabled) {
                    log.warn("执行拦截器后置方法发生例外！", e)
                }
            }
        }
    }

}
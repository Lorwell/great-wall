package cc.shacocloud.greatwall.config.web

import org.springframework.beans.factory.BeanFactoryUtils
import org.springframework.context.ApplicationContext
import org.springframework.context.ApplicationContextAware
import org.springframework.core.annotation.AnnotationAwareOrderComparator
import org.springframework.http.HttpStatus
import org.springframework.util.ObjectUtils
import org.springframework.web.cors.reactive.CorsUtils
import org.springframework.web.cors.reactive.PreFlightRequestHandler
import org.springframework.web.reactive.*
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebHandler
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

/**
 *  基于 [DispatcherHandler] 改造使其更方便拓展
 *
 * @author 思追(shaco)
 */
open class WebFluxDispatcherHandler() : WebHandler, PreFlightRequestHandler, ApplicationContextAware {

    private val handlerMappings = mutableListOf<HandlerMapping>()

    private val handlerAdapters = mutableListOf<HandlerAdapter>()

    private val resultHandlers = mutableListOf<HandlerResultHandler>()

    constructor(applicationContext: ApplicationContext) : this() {
        initStrategies(applicationContext)
    }

    override fun setApplicationContext(applicationContext: ApplicationContext) {
        initStrategies(applicationContext)
    }

    /**
     * 设置 [HandlerMapping]
     */
    open fun handlerMapping(mappings: List<HandlerMapping>) {
        handlerMappings.addAll(mappings)
        AnnotationAwareOrderComparator.sort(handlerMappings)
    }

    /**
     * 设置 [HandlerAdapter]
     */
    open fun handlerAdapters(adapters: List<HandlerAdapter>) {
        handlerAdapters.addAll(adapters)
        AnnotationAwareOrderComparator.sort(handlerAdapters)
    }

    /**
     * 设置 [HandlerResultHandler]
     */
    open fun resultHandlers(handlers: List<HandlerResultHandler>) {
        resultHandlers.addAll(handlers)
        AnnotationAwareOrderComparator.sort(resultHandlers)
    }

    /**
     *  初始化
     */
    private fun initStrategies(context: ApplicationContext) {
        val mappingBeans = BeanFactoryUtils.beansOfTypeIncludingAncestors(
            context, HandlerMapping::class.java, true, false
        )
        handlerMapping(mappingBeans.values.toList())

        val adapterBeans = BeanFactoryUtils.beansOfTypeIncludingAncestors(
            context, HandlerAdapter::class.java, true, false
        )
        handlerAdapters(adapterBeans.values.toList())

        val resultBeans = BeanFactoryUtils.beansOfTypeIncludingAncestors(
            context, HandlerResultHandler::class.java, true, false
        )
        resultHandlers(resultBeans.values.toList())
    }


    override fun handle(exchange: ServerWebExchange): Mono<Void> {
        val handlerMappings = this.handlerMappings

        if (CorsUtils.isPreFlightRequest(exchange.request)) {
            return handlePreFlight(exchange)
        }

        return Flux.fromIterable(handlerMappings)
            .concatMap { it.getHandler(exchange) }
            .next()
            .switchIfEmpty(createNotFoundError())
            .onErrorResume { ex -> handleResultMono(exchange, Mono.error(ex)) }
            .flatMap { handler -> handleRequestWith(exchange, handler) }
    }

    open fun <R> createNotFoundError(): Mono<R> {
        return Mono.defer {
            val ex: Exception = ResponseStatusException(HttpStatus.NOT_FOUND)
            Mono.error(ex)
        }
    }

    open fun handleResultMono(
        exchange: ServerWebExchange,
        resultMono: Mono<HandlerResult>
    ): Mono<Void> {
        var handlerResultMono = resultMono

        if (handlerAdapters.isNotEmpty()) {
            for (adapter in handlerAdapters) {
                if (adapter is DispatchExceptionHandler) {
                    handlerResultMono = handlerResultMono.onErrorResume { adapter.handleError(exchange, it) }
                }
            }
        }

        return handlerResultMono.flatMap { result ->
            var voidMono = handleResult(exchange, result, "Handler " + result.handler)
            val exceptionHandler = result.exceptionHandler
            if (exceptionHandler != null) {
                voidMono = voidMono.onErrorResume { ex ->
                    exceptionHandler.handleError(exchange, ex).flatMap { result2 ->
                        handleResult(
                            exchange, result2, "Exception handler ${result2.handler}, error=\"${ex.message}\""
                        )
                    }
                }
            }
            voidMono
        }
    }

    open fun handleResult(
        exchange: ServerWebExchange, handlerResult: HandlerResult, description: String
    ): Mono<Void> {
        var descriptionStr = description

        if (resultHandlers.isNotEmpty()) {
            for (resultHandler in resultHandlers) {
                if (resultHandler.supports(handlerResult)) {
                    descriptionStr += " [WebFluxDispatcherHandler]"
                    return resultHandler.handleResult(exchange, handlerResult).checkpoint(descriptionStr)
                }
            }
        }

        return Mono.error(IllegalStateException("没有 HandlerResultHandler 处理结果值：${handlerResult.returnValue}"))
    }

    open fun handleRequestWith(exchange: ServerWebExchange, handler: Any): Mono<Void> {
        if (ObjectUtils.nullSafeEquals(exchange.response.statusCode, HttpStatus.FORBIDDEN)) {
            return Mono.empty() // CORS 拒绝
        }

        if (handlerAdapters.isNotEmpty()) {
            for (adapter in handlerAdapters) {
                if (adapter.supports(handler)) {
                    val resultMono = adapter.handle(exchange, handler)
                    return handleResultMono(exchange, resultMono)
                }
            }
        }

        return Mono.error(IllegalStateException("没有 HandlerAdapter 处理：$handler"))
    }

    override fun handlePreFlight(exchange: ServerWebExchange): Mono<Void> {
        return Flux.fromIterable(handlerMappings).concatMap { mapping -> mapping.getHandler(exchange) }
            .switchIfEmpty(Mono.fromRunnable { exchange.response.setStatusCode(HttpStatus.FORBIDDEN) }).next().then()
    }
}

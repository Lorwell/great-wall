package cc.shacocloud.greatwall.config.web

import io.micrometer.observation.ObservationRegistry
import org.springframework.beans.factory.NoSuchBeanDefinitionException
import org.springframework.context.ApplicationContext
import org.springframework.http.codec.ServerCodecConfigurer
import org.springframework.http.server.reactive.HttpHandler
import org.springframework.http.server.reactive.HttpHandlerDecoratorFactory
import org.springframework.http.server.reactive.observation.ServerRequestObservationConvention
import org.springframework.web.server.WebExceptionHandler
import org.springframework.web.server.WebFilter
import org.springframework.web.server.WebHandler
import org.springframework.web.server.adapter.ForwardedHeaderTransformer
import org.springframework.web.server.adapter.HttpWebHandlerAdapter
import org.springframework.web.server.handler.ExceptionHandlingWebHandler
import org.springframework.web.server.handler.FilteringWebHandler
import org.springframework.web.server.i18n.LocaleContextResolver
import org.springframework.web.server.session.WebSessionManager
import java.util.function.Function

/**
 * 基于 [org.springframework.web.server.adapter.WebHttpHandlerBuilder] 进行的改造，使其更方便拓展
 *
 * @see org.springframework.web.server.adapter.WebHttpHandlerBuilder
 * @see HttpWebHandlerAdapter
 */
class WebFluxHttpHandlerBuilder(
    private val applicationContext: ApplicationContext
) {

    companion object {
        /** bean 工厂中目标 WebHandler 的名称  */
        const val WEB_HANDLER_BEAN_NAME: String = "webHandler"

        /** bean 工厂中目标 WebSessionManager 的名称  */
        const val WEB_SESSION_MANAGER_BEAN_NAME: String = "webSessionManager"

        /** bean 工厂中目标 ServerCodecConfigurer 的名称  */
        const val SERVER_CODEC_CONFIGURER_BEAN_NAME: String = "serverCodecConfigurer"

        /** bean 工厂中目标 LocaleContextResolver 的名称  */
        const val LOCALE_CONTEXT_RESOLVER_BEAN_NAME: String = "localeContextResolver"

        /** bean 工厂中目标 ForwardedHeaderTransformer 的名称  */
        const val FORWARDED_HEADER_TRANSFORMER_BEAN_NAME: String = "forwardedHeaderTransformer"
    }

    private var webHandler: WebHandler? = null

    private var httpHandlerDecorator: Function<HttpHandler, HttpHandler>? = null

    private var webHandlerDecorator: Function<WebHandler, WebHandler>? = null

    private var sessionManager: WebSessionManager? = null

    private var codecConfigurer: ServerCodecConfigurer? = null

    private var localeContextResolver: LocaleContextResolver? = null

    private var forwardedHeaderTransformer: ForwardedHeaderTransformer? = null

    private var observationRegistry: ObservationRegistry? = null

    private var observationConvention: ServerRequestObservationConvention? = null

    private val filters = mutableListOf<WebFilter>()

    private val exceptionHandlers = mutableListOf<WebExceptionHandler>()

    /**
     * 添加 [WebFilter]
     */
    fun filter(filters: List<WebFilter>): WebFluxHttpHandlerBuilder {
        if (filters.isNotEmpty()) {
            this.filters.addAll(filters)
            updateFilters()
        }
        return this
    }

    /**
     * 更新过滤器
     */
    private fun updateFilters() {
        if (filters.isEmpty()) {
            return
        }

        val filtersToUse = filters
            .filter { filter ->
                if (filter is ForwardedHeaderTransformer) {

                    if (this.forwardedHeaderTransformer == null) {
                        this.forwardedHeaderTransformer = filter
                    }

                    false
                } else {
                    true
                }
            }
            .toList()

        filters.clear()
        filters.addAll(filtersToUse)
    }

    /**
     * 添加给定的异常处理程序
     */
    fun exceptionHandler(handlers: List<WebExceptionHandler>): WebFluxHttpHandlerBuilder {
        if (handlers.isNotEmpty()) {
            exceptionHandlers.addAll(handlers)
        }
        return this
    }

    /**
     * 配置一个 [Function] 来修饰此构建器返回的 [HttpHandler]
     *
     * 该函数有效地包装了整个 [WebExceptionHandler] - [WebFilter] - [WebHandler] 处理链。
     * 这提供了在整个链之前访问请求和响应的能力，同样也提供了观察整个链结果的能力。
     */
    fun httpHandlerDecorator(handlerDecorator: Function<HttpHandler, HttpHandler>): WebFluxHttpHandlerBuilder {
        val httpHandlerDecorator = this.httpHandlerDecorator
        this.httpHandlerDecorator =
            if (httpHandlerDecorator != null) handlerDecorator.andThen(httpHandlerDecorator) else handlerDecorator
        return this
    }

    /**
     * 配置一个 [Function] 来修饰此构建器返回的 [WebHandler]
     */
    fun webHandlerDecorator(handlerDecorator: Function<WebHandler, WebHandler>): WebFluxHttpHandlerBuilder {
        val webHandlerDecorator = this.webHandlerDecorator
        this.webHandlerDecorator =
            if (webHandlerDecorator != null) handlerDecorator.andThen(webHandlerDecorator) else handlerDecorator
        return this
    }

    /**
     * 配置 [WebHandler]
     */
    fun webHandler(webHandler: WebHandler): WebFluxHttpHandlerBuilder {
        this.webHandler = webHandler
        return this
    }

    /**
     * 是否配置了 [WebHandler]
     */
    fun hasWebHandler(): Boolean {
        return (this.webHandler != null)
    }

    /**
     * 配置要在 [org.springframework.web.server.ServerWebExchange]上设置的[WebSessionManager]
     *
     * 默认使用 [org.springframework.web.server.session.DefaultWebSessionManager]
     *
     * @see HttpWebHandlerAdapter.setSessionManager
     */
    fun sessionManager(manager: WebSessionManager): WebFluxHttpHandlerBuilder {
        this.sessionManager = manager
        return this
    }

    /**
     * 是否配置了 [WebSessionManager]
     */
    fun hasSessionManager(): Boolean {
        return (this.sessionManager != null)
    }

    /**
     * 配置 [ServerCodecConfigurer]
     */
    fun codecConfigurer(codecConfigurer: ServerCodecConfigurer): WebFluxHttpHandlerBuilder {
        this.codecConfigurer = codecConfigurer
        return this
    }


    /**
     * 是否配置 [ServerCodecConfigurer]
     */
    fun hasCodecConfigurer(): Boolean {
        return (this.codecConfigurer != null)
    }

    /**
     *  配置 [LocaleContextResolver]
     */
    fun localeContextResolver(localeContextResolver: LocaleContextResolver): WebFluxHttpHandlerBuilder {
        this.localeContextResolver = localeContextResolver
        return this
    }

    /**
     * 是否配置 [LocaleContextResolver]
     */
    fun hasLocaleContextResolver(): Boolean {
        return (this.localeContextResolver != null)
    }

    /**
     * 配置 [ForwardedHeaderTransformer]
     */
    fun forwardedHeaderTransformer(transformer: ForwardedHeaderTransformer): WebFluxHttpHandlerBuilder {
        this.forwardedHeaderTransformer = transformer
        return this
    }

    /**
     * 是否配置 [ForwardedHeaderTransformer]
     */
    fun hasForwardedHeaderTransformer(): Boolean {
        return (this.forwardedHeaderTransformer != null)
    }

    /**
     * 配置 [ObservationRegistry] 以记录服务器交换观察结果。默认情况下，将配置 [ObservationRegistry.NOOP] 注册表。
     */
    fun observationRegistry(observationRegistry: ObservationRegistry): WebFluxHttpHandlerBuilder {
        this.observationRegistry = observationRegistry
        return this
    }

    /**
     * 配置用于服务器观察的 [ServerRequestObservationConvention]
     *
     * 默认情况下，将使用 [org.springframework.http.server.reactive.observation.DefaultServerRequestObservationConvention]
     */
    fun observationConvention(observationConvention: ServerRequestObservationConvention): WebFluxHttpHandlerBuilder {
        this.observationConvention = observationConvention
        return this
    }

    /**
     * 从 [ApplicationContext] 中加载需要的 web 配置，通过配置参数指定配置是否装载
     */
    fun applyApplicationContext(
        webHandler: Boolean = true,
        webFilter: Boolean = true,
        exceptionHandler: Boolean = true,
        httpHandlerDecoratorFactory: Boolean = true,
        observationRegistry: Boolean = true,
        serverRequestObservationConvention: Boolean = true,
        webSessionManager: Boolean = true,
        serverCodecConfigurer: Boolean = true,
        localeContextResolver: Boolean = true,
        forwardedHeaderTransformer: Boolean = true
    ): WebFluxHttpHandlerBuilder {

        if (webHandler) {
            webHandler(applicationContext.getBean(WEB_HANDLER_BEAN_NAME, WebHandler::class.java))
        }

        if (webFilter) {
            filter(
                applicationContext
                    .getBeanProvider(WebFilter::class.java)
                    .orderedStream()
                    .toList()
            )
        }

        if (exceptionHandler) {
            exceptionHandler(
                applicationContext
                    .getBeanProvider(WebExceptionHandler::class.java)
                    .orderedStream()
                    .toList()
            )
        }

        if (httpHandlerDecoratorFactory) {
            applicationContext.getBeanProvider(HttpHandlerDecoratorFactory::class.java)
                .orderedStream()
                .forEach { httpHandlerDecorator(it) }
        }

        if (observationRegistry) {
            applicationContext.getBeanProvider(ObservationRegistry::class.java)
                .ifUnique { observationRegistry(it) }
        }

        if (serverRequestObservationConvention) {
            applicationContext.getBeanProvider(ServerRequestObservationConvention::class.java)
                .ifAvailable { observationConvention(it) }
        }

        if (webSessionManager) {
            try {
                sessionManager(applicationContext.getBean(WEB_SESSION_MANAGER_BEAN_NAME, WebSessionManager::class.java))
            } catch (_: NoSuchBeanDefinitionException) {
            }
        }

        if (serverCodecConfigurer) {
            try {
                codecConfigurer(
                    applicationContext.getBean(SERVER_CODEC_CONFIGURER_BEAN_NAME, ServerCodecConfigurer::class.java)
                )
            } catch (_: NoSuchBeanDefinitionException) {
            }
        }

        if (localeContextResolver) {
            try {
                localeContextResolver(
                    applicationContext.getBean(LOCALE_CONTEXT_RESOLVER_BEAN_NAME, LocaleContextResolver::class.java)
                )
            } catch (_: NoSuchBeanDefinitionException) {
            }
        }

        if (forwardedHeaderTransformer) {
            try {
                forwardedHeaderTransformer(
                    applicationContext.getBean(
                        FORWARDED_HEADER_TRANSFORMER_BEAN_NAME,
                        ForwardedHeaderTransformer::class.java
                    )
                )
            } catch (_: NoSuchBeanDefinitionException) {
            }
        }

        return this
    }


    /**
     * 构建 [HttpHandler]
     */
    fun build(): HttpHandler {
        val webHandler = this.webHandler ?: applicationContext.getBean(WEB_HANDLER_BEAN_NAME, WebHandler::class.java)

        var decorated: WebHandler = this.webHandlerDecorator?.apply(webHandler) ?: webHandler

        decorated = FilteringWebHandler(decorated, this.filters)
        decorated = ExceptionHandlingWebHandler(decorated, this.exceptionHandlers)

        val adapted = HttpWebHandlerAdapter(decorated)
        if (this.sessionManager != null) {
            adapted.sessionManager = this.sessionManager!!
        }
        if (this.codecConfigurer != null) {
            adapted.codecConfigurer = this.codecConfigurer!!
        }
        if (this.localeContextResolver != null) {
            adapted.localeContextResolver = this.localeContextResolver!!
        }
        if (this.forwardedHeaderTransformer != null) {
            adapted.forwardedHeaderTransformer = this.forwardedHeaderTransformer
        }
        if (this.observationRegistry != null) {
            adapted.observationRegistry = this.observationRegistry!!
        }
        if (this.observationConvention != null) {
            adapted.observationConvention = this.observationConvention!!
        }

        adapted.setApplicationContext(this.applicationContext)
        adapted.afterPropertiesSet()

        return this.httpHandlerDecorator?.apply(adapted) ?: adapted
    }


}

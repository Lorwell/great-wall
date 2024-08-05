package cc.shacocloud.greatwall.config.web

import cc.shacocloud.greatwall.config.web.MainNettyReactiveWebServerFactory.Companion.MAIN_NETTY_REACTIVE_WEB_SERVER_FACTORY_BEAN_NAME
import cc.shacocloud.greatwall.config.web.WebConfiguration.Companion.MAIN_REACTOR_RESOURCE_FACTORY_BEAN_NAME
import cc.shacocloud.greatwall.service.CompositionMonitorMetricsService
import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.web.embedded.netty.NettyReactiveWebServerFactory
import org.springframework.boot.web.embedded.netty.NettyServerCustomizer
import org.springframework.cloud.gateway.handler.RoutePredicateHandlerMapping
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.http.client.ReactorResourceFactory
import org.springframework.http.server.reactive.HttpHandler
import org.springframework.web.reactive.HandlerAdapter
import org.springframework.web.reactive.HandlerMapping
import org.springframework.web.reactive.result.SimpleHandlerAdapter
import reactor.netty.http.server.HttpServer
import java.util.concurrent.atomic.AtomicBoolean

/**
 * 主服务端口设置
 * 主服务的 tls web server 见 [AutoTLSReactiveWebServerApplicationContext]
 *
 * @author 思追(shaco)
 */
@Primary
@Configuration(MAIN_NETTY_REACTIVE_WEB_SERVER_FACTORY_BEAN_NAME)
@EnableConfigurationProperties(MainServerProperties::class)
class MainNettyReactiveWebServerFactory(
    private val applicationContext: ApplicationContext,
    val mainServerProperties: MainServerProperties,
    @Qualifier(MAIN_REACTOR_RESOURCE_FACTORY_BEAN_NAME) val reactorResourceFactory: ReactorResourceFactory,
) : NettyReactiveWebServerFactory() {

    companion object {
        const val MAIN_HTTP_HANDLER_BEAN_NAME = "mainHttpHandler"
        const val MAIN_NETTY_REACTIVE_WEB_SERVER_FACTORY_BEAN_NAME = "MainNettyReactiveWebServerFactory"
    }

    private val noTlsConf = AtomicBoolean(false)

    /**
     * 绑定服务端口
     */
    @PostConstruct
    fun init() {
        addServerCustomizers(object : NettyServerCustomizer {
            override fun apply(server: HttpServer): HttpServer {
                if (noTlsConf.get()) {
                    return server.port(mainServerProperties.port)
                }
                return server
            }
        })

        setResourceFactory(reactorResourceFactory)
    }

    /**
     * 主服务的http处理器
     */
    @Bean(MAIN_HTTP_HANDLER_BEAN_NAME)
    fun mainHttpHandler(
        mainServerErrorHandler: MainServerErrorHandler,
    ): HttpHandler {
        // 主服务只绑定一个条件处理器
        val dispatcherHandler = object : WebFluxDispatcherHandler(applicationContext) {

            override fun handlerAdapters(adapters: List<HandlerAdapter>) {
                val handlers = adapters.filterIsInstance<SimpleHandlerAdapter>()
                super.handlerAdapters(handlers)
            }

            override fun handlerMapping(mappings: List<HandlerMapping>) {
                val handlers = mappings.filterIsInstance<RoutePredicateHandlerMapping>()
                super.handlerMapping(handlers)
            }
        }

        // 定制的异常处理器

        // 使用监控指标处理器来委托目标处理器
        val mainWebHandler = MonitorRouteMetricsWebHandler(
            webHandler = dispatcherHandler,
            monitorMetricsService = applicationContext.getBean(CompositionMonitorMetricsService::class.java)
        )

        return WebFluxHttpHandlerBuilder(applicationContext)
            .applyApplicationContext(
                webHandler = false,
                exceptionHandler = false
            )
            .webHandler(mainWebHandler)
            .exceptionHandler(listOf(mainServerErrorHandler))
            .build()
    }


    /**
     * 主web服务的 非 tls 证书认证的端口
     */
    @Bean
    fun mainWebServer(
        @Qualifier(MAIN_HTTP_HANDLER_BEAN_NAME) httpHandler: HttpHandler,
    ): SimpleWebServer {
        noTlsConf.set(true)
        try {
            val mainHttpHandler = MainServerNoTlsHttpHandler(httpHandler)
            val configWebServer = super.getWebServer(mainHttpHandler)
            return SimpleWebServer(configWebServer)
        } finally {
            noTlsConf.set(false)
        }
    }

}
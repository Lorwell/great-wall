package cc.shacocloud.greatwall.config.web

import cc.shacocloud.greatwall.service.CompositionMonitorMetricsService
import cc.shacocloud.greatwall.utils.Slf4j
import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.ObjectProvider
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.web.embedded.netty.NettyReactiveWebServerFactory
import org.springframework.boot.web.embedded.netty.NettyServerCustomizer
import org.springframework.cloud.gateway.handler.RoutePredicateHandlerMapping
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.http.server.reactive.HttpHandler
import org.springframework.web.reactive.HandlerAdapter
import org.springframework.web.reactive.HandlerMapping
import org.springframework.web.reactive.result.method.annotation.RequestMappingHandlerAdapter
import reactor.netty.http.server.HttpServer
import java.util.concurrent.atomic.AtomicBoolean

/**
 * Web Flux 多端口配置
 *
 * 将端口分为2个，主端口和配置端口
 *
 * 主端口只用于执行代理策略
 *
 * 配置端口用于配置代理策略
 *
 * 主服务的 tls web server 见 [AutoTLSReactiveWebServerApplicationContext]
 *
 * @author 思追(shaco)
 */
@Slf4j
@Configuration
@EnableConfigurationProperties(ConfigServerProperties::class, MainServerProperties::class)
class WebFluxServerConfiguration(
    private val applicationContext: ApplicationContext,
    val configServerProperties: ConfigServerProperties,
    val mainServerProperties: MainServerProperties
) : NettyReactiveWebServerFactory() {

    companion object {
        const val MAIN_HTTP_HANDLER_BEAN_NAME = "mainHttpHandler"
    }

    private val configPortInit = AtomicBoolean(false)
    private val mainPortInit = AtomicBoolean(false)

    /**
     * 绑定服务端口
     */
    @PostConstruct
    fun init() {
        addServerCustomizers(object : NettyServerCustomizer {
            override fun apply(server: HttpServer): HttpServer {
                if (configPortInit.get()) {
                    return server.port(configServerProperties.port)
                } else if (mainPortInit.get()) {
                    return server.port(mainServerProperties.port)
                }
                return server
            }

        })
    }

    /**
     * 配置web服务
     */
    @Bean
    fun configWebServer(interceptorProvider: ObjectProvider<RequestMappingHandlerInterceptor>): SimpleWebServer {
        configPortInit.set(true)
        try {
            val dispatcherHandler = object : WebFluxDispatcherHandler(applicationContext) {

                override fun handlerMapping(mappings: List<HandlerMapping>) {
                    val handlers = mappings.filter { it !is RoutePredicateHandlerMapping }
                    super.handlerMapping(handlers)
                }

                // 拓展用户认证
                override fun handlerAdapters(adapters: List<HandlerAdapter>) {
                    val handlers = adapters.map {
                        if (it is RequestMappingHandlerAdapter) {
                            RequestMappingHandlerInterceptorAdapter(it, interceptorProvider)
                        } else {
                            it
                        }
                    }
                    super.handlerAdapters(handlers)
                }
            }

            val configHttpHandler = WebFluxHttpHandlerBuilder(applicationContext)
                .applyApplicationContext(
                    webHandler = false
                )
                .webHandler(dispatcherHandler)
                .build()


            val configWebServer = super.getWebServer(configHttpHandler)
            return SimpleWebServer(configWebServer)
        } finally {
            configPortInit.set(false)
        }
    }

    /**
     * 主服务的http处理器
     */
    @Bean(MAIN_HTTP_HANDLER_BEAN_NAME)
    fun mainHttpHandler(): HttpHandler {
        // 主服务只绑定一个条件处理器
        val dispatcherHandler = object : WebFluxDispatcherHandler(applicationContext) {

            override fun handlerMapping(mappings: List<HandlerMapping>) {
                val handlers = mappings.filterIsInstance<RoutePredicateHandlerMapping>()
                super.handlerMapping(handlers)
            }
        }

        // 使用监控指标处理器来委托目标处理器
        val mainWebHandler = MonitorRouteMetricsWebHandler(
            webHandler = dispatcherHandler,
            monitorMetricsService = applicationContext.getBean(CompositionMonitorMetricsService::class.java)
        )

        return WebFluxHttpHandlerBuilder(applicationContext)
            .applyApplicationContext(
                webHandler = false
            )
            .webHandler(mainWebHandler)
            .build()
    }


    /**
     * 主web服务的 非 tls 证书认证的端口
     */
    @Bean
    fun mainWebServer(
        @Qualifier(MAIN_HTTP_HANDLER_BEAN_NAME) httpHandler: HttpHandler
    ): SimpleWebServer {
        mainPortInit.set(true)
        try {
            val mainHttpHandler = MainServerNoTlsHttpHandler(httpHandler, mainServerProperties)
            val configWebServer = super.getWebServer(mainHttpHandler)
            return SimpleWebServer(configWebServer)
        } finally {
            mainPortInit.set(false)
        }
    }

}
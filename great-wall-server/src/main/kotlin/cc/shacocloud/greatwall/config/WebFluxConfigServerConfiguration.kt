package cc.shacocloud.greatwall.config

import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.setValue
import jakarta.annotation.PostConstruct
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.web.embedded.netty.NettyReactiveWebServerFactory
import org.springframework.boot.web.embedded.netty.NettyServerCustomizer
import org.springframework.boot.web.server.WebServer
import org.springframework.cloud.gateway.handler.RoutePredicateHandlerMapping
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.event.EventListener
import org.springframework.web.reactive.DispatcherHandler
import org.springframework.web.reactive.HandlerMapping
import org.springframework.web.server.WebHandler
import org.springframework.web.server.adapter.HttpWebHandlerAdapter
import org.springframework.web.server.adapter.WebHttpHandlerBuilder
import org.springframework.web.server.handler.WebHandlerDecorator
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
 * 主服务见 [AutoTLSReactiveWebServerApplicationContext]
 *
 * @author 思追(shaco)
 */
@Slf4j
@Configuration
@EnableConfigurationProperties(ConfigServerProperties::class)
class WebFluxConfigServerConfiguration(
    private val applicationContext: ApplicationContext,
    configServerProperties: ConfigServerProperties
) : NettyReactiveWebServerFactory() {

    private val configPort = configServerProperties.port
    private val configPostInit = AtomicBoolean(false)

    /**
     * 绑定配置服务为指定端口
     */
    @PostConstruct
    fun init() {
        addServerCustomizers(object : NettyServerCustomizer {
            override fun apply(server: HttpServer): HttpServer {
                if (configPostInit.get()) {
                    return server.port(configPort)
                }
                return server
            }

        })
    }

    /**
     * 配置web服务
     */
    @Bean(destroyMethod = "stop")
    fun configWebServer(): ConfigWebServer {
        configPostInit.set(true)
        try {
            val configHttpHandler = WebHttpHandlerBuilder.applicationContext(applicationContext)
                .httpHandlerDecorator { httpHandler ->

                    // 匹配到 DispatcherHandler
                    var delegate: WebHandler = httpHandler as HttpWebHandlerAdapter
                    while (delegate !is DispatcherHandler) {
                        if (delegate is WebHandlerDecorator) {
                            delegate = delegate.delegate
                        } else {
                            throw RuntimeException("Web 服务器处理器内未匹配到 DispatcherHandler")
                        }
                    }

                    // 排除 RoutePredicateHandlerMapping 这个处理器
                    val dispatcherHandler = delegate
                    val handlerMappings =
                        dispatcherHandler.handlerMappings?.filter { it !is RoutePredicateHandlerMapping }
                    val handlerMappingsField = DispatcherHandler::class.java.getDeclaredField("handlerMappings")
                    handlerMappingsField.setValue(dispatcherHandler, handlerMappings ?: listOf<HandlerMapping>())

                    httpHandler
                }
                .build()


            val configWebServer = super.getWebServer(configHttpHandler)
            return ConfigWebServer(configWebServer)
        } finally {
            configPostInit.set(false)
        }
    }

    class ConfigWebServer(
        private val webServer: WebServer
    ) {

        @EventListener(ApplicationReadyEvent::class)
        fun start() {
            webServer.start()
        }

        fun stop() {
            webServer.stop()
        }

    }

}
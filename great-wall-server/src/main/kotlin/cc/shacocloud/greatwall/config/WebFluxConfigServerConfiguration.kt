package cc.shacocloud.greatwall.config

import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.DisposableBean
import org.springframework.boot.autoconfigure.web.reactive.WebFluxRegistrations
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.web.embedded.netty.NettyReactiveWebServerFactory
import org.springframework.boot.web.embedded.netty.NettyServerCustomizer
import org.springframework.boot.web.embedded.netty.NettyWebServer
import org.springframework.boot.web.server.WebServer
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.event.EventListener
import org.springframework.http.server.reactive.HttpHandler
import org.springframework.util.ReflectionUtils
import org.springframework.web.reactive.DispatcherHandler
import org.springframework.web.reactive.result.method.annotation.RequestMappingHandlerMapping
import org.springframework.web.server.adapter.WebHttpHandlerBuilder
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
     * 自定义 [WebFluxRegistrations] 的 [RequestMappingHandlerMapping] 屏蔽主端口的所有控制器
     */
    @Bean
    fun webFluxRegistrations(): WebFluxRegistrations {
        return object : WebFluxRegistrations {
            override fun getRequestMappingHandlerMapping(): RequestMappingHandlerMapping {
                return object : RequestMappingHandlerMapping() {
                    override fun isHandler(beanType: Class<*>): Boolean {
                        return false
                    }
                }
            }
        }
    }

    /**
     * 配置服务请求映射处理器
     */
    @Bean
    fun configServerRequestMappingHandlerMapping(): RequestMappingHandlerMapping {
        return RequestMappingHandlerMapping()
    }

    @Bean(destroyMethod = "stop")
    fun configWebServer(): ConfigWebServer {
        val webServer = createConfigWebServer()
        return ConfigWebServer(webServer)
    }

    /**
     * 创建 配置服务
     */
    fun createConfigWebServer(): WebServer {
        configPostInit.set(true)
        try {
            val dispatcherHandler = DispatcherHandler(applicationContext)
            val handlerMapping = configServerRequestMappingHandlerMapping()
            val handlerMappings = mutableListOf(handlerMapping) + dispatcherHandler.handlerMappings

            val handlerMappingsField = DispatcherHandler::class.java.getDeclaredField("handlerMappings")
            ReflectionUtils.makeAccessible(handlerMappingsField)
            ReflectionUtils.setField(
                handlerMappingsField,
                dispatcherHandler,
                handlerMappings
            )

            val configHttpHandlerBuilder = WebHttpHandlerBuilder.applicationContext(applicationContext);

            val webHandlerField = WebHttpHandlerBuilder::class.java.getDeclaredField("webHandler")
            ReflectionUtils.makeAccessible(webHandlerField)
            ReflectionUtils.setField(
                webHandlerField,
                configHttpHandlerBuilder,
                dispatcherHandler
            )

            val configWebServer = super.getWebServer(configHttpHandlerBuilder.build()) as NettyWebServer

            return configWebServer
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
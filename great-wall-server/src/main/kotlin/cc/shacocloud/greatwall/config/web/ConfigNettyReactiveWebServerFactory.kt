package cc.shacocloud.greatwall.config.web

import cc.shacocloud.greatwall.config.web.WebConfiguration.Companion.CONFIG_REACTOR_RESOURCE_FACTORY_BEAN_NAME
import cc.shacocloud.greatwall.config.web.interceptor.RequestMappingHandlerInterceptor
import cc.shacocloud.greatwall.config.web.interceptor.RequestMappingHandlerInterceptorAdapter
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import jakarta.annotation.PostConstruct
import org.springframework.beans.factory.ObjectProvider
import org.springframework.beans.factory.annotation.Qualifier
import org.springframework.boot.autoconfigure.jackson.Jackson2ObjectMapperBuilderCustomizer
import org.springframework.boot.context.properties.EnableConfigurationProperties
import org.springframework.boot.web.embedded.netty.NettyReactiveWebServerFactory
import org.springframework.boot.web.embedded.netty.NettyServerCustomizer
import org.springframework.cloud.gateway.handler.RoutePredicateHandlerMapping
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.http.client.ReactorResourceFactory
import org.springframework.http.converter.json.Jackson2ObjectMapperBuilder
import org.springframework.web.reactive.HandlerAdapter
import org.springframework.web.reactive.HandlerMapping
import org.springframework.web.reactive.result.method.annotation.RequestMappingHandlerAdapter
import reactor.netty.http.server.HttpServer
import java.time.LocalDateTime


/**
 * 配置服务端口配置
 *
 * @author 思追(shaco)
 * @see MainNettyReactiveWebServerFactory
 */
@Primary
@Configuration
@EnableConfigurationProperties(ConfigServerProperties::class)
class ConfigNettyReactiveWebServerFactory(
    val applicationContext: ApplicationContext,
    val configServerProperties: ConfigServerProperties,
    @Qualifier(CONFIG_REACTOR_RESOURCE_FACTORY_BEAN_NAME) val reactorResourceFactory: ReactorResourceFactory,
) : NettyReactiveWebServerFactory() {

    /**
     * 绑定服务端口
     */
    @PostConstruct
    fun init() {
        addServerCustomizers(object : NettyServerCustomizer {
            override fun apply(server: HttpServer): HttpServer {
                return server.port(configServerProperties.port)
            }
        })

        setResourceFactory(reactorResourceFactory)
    }

    /**
     * 配置web服务
     */
    @Bean
    fun configWebServer(interceptorProvider: ObjectProvider<RequestMappingHandlerInterceptor>): SimpleWebServer {
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
    }

}
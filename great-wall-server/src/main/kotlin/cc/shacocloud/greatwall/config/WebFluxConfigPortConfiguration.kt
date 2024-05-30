package cc.shacocloud.greatwall.config

import org.springframework.beans.factory.BeanFactoryUtils
import org.springframework.beans.factory.ListableBeanFactory
import org.springframework.beans.factory.NoSuchBeanDefinitionException
import org.springframework.boot.actuate.autoconfigure.web.ManagementContextConfiguration
import org.springframework.boot.actuate.autoconfigure.web.ManagementContextType
import org.springframework.boot.autoconfigure.condition.ConditionalOnWebApplication
import org.springframework.boot.autoconfigure.web.embedded.*
import org.springframework.boot.autoconfigure.web.reactive.ReactiveWebServerFactoryCustomizer
import org.springframework.boot.autoconfigure.web.reactive.TomcatReactiveWebServerFactoryCustomizer
import org.springframework.boot.web.reactive.server.ConfigurableReactiveWebServerFactory
import org.springframework.boot.web.server.ConfigurableWebServerFactory
import org.springframework.boot.web.server.WebServerFactoryCustomizer
import org.springframework.context.ApplicationContext
import org.springframework.context.annotation.Bean
import org.springframework.core.Ordered
import org.springframework.http.server.reactive.HttpHandler
import org.springframework.web.reactive.config.EnableWebFlux
import org.springframework.web.server.adapter.WebHttpHandlerBuilder

/**
 * Web Flux 多端口配置
 *
 * 将端口分为2个，主端口和配置端口
 *
 * 主端口只用于执行代理策略
 * 配置端口用于配置代理策略
 *
 * @author 思追(shaco)
 */
@EnableWebFlux
@ManagementContextConfiguration(value = ManagementContextType.CHILD, proxyBeanMethods = false)
@ConditionalOnWebApplication(type = ConditionalOnWebApplication.Type.REACTIVE)
class WebFluxConfigPortConfiguration {

    /**
     * 配置端口web服务工厂
     */
    @Bean
    fun wbFluxConfigPortWebServerFactoryCustomizer(
        beanFactory: ListableBeanFactory
    ): WebFluxConfigPortWebServerFactoryCustomizer {
        return WebFluxConfigPortWebServerFactoryCustomizer(beanFactory)
    }

    /**
     * http处理器
     */
    @Bean
    fun httpHandler(applicationContext: ApplicationContext): HttpHandler {
        val httpHandler = WebHttpHandlerBuilder.applicationContext(applicationContext).build()
        return httpHandler
    }

    class WebFluxConfigPortWebServerFactoryCustomizer(
        private val beanFactory: ListableBeanFactory
    ) : WebServerFactoryCustomizer<ConfigurableReactiveWebServerFactory>, Ordered {

        private val customizerClasses = arrayOf(
            ReactiveWebServerFactoryCustomizer::class.java,
            TomcatWebServerFactoryCustomizer::class.java,
            TomcatReactiveWebServerFactoryCustomizer::class.java,
            TomcatVirtualThreadsWebServerFactoryCustomizer::class.java,
            JettyWebServerFactoryCustomizer::class.java,
            JettyVirtualThreadsWebServerFactoryCustomizer::class.java,
            UndertowWebServerFactoryCustomizer::class.java,
            NettyWebServerFactoryCustomizer::class.java
        )

        override fun customize(factory: ConfigurableReactiveWebServerFactory) {
            val customizers = mutableListOf<WebServerFactoryCustomizer<out ConfigurableWebServerFactory>>()
            for (customizerClass in this.customizerClasses) {
                try {
                    val factoryCustomizer =
                        BeanFactoryUtils.beanOfTypeIncludingAncestors(this.beanFactory, customizerClass)
                    customizers.add(factoryCustomizer)
                } catch (ignore: NoSuchBeanDefinitionException) {
                }
            }

            customizers.forEach { it.customize(factory as Nothing) }

            factory.setErrorPages(emptySet())

            factory.setPort(8082)
        }

        override fun getOrder(): Int {
            return 0
        }

    }

}
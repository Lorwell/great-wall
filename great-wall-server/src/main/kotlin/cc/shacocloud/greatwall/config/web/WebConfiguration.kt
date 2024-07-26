package cc.shacocloud.greatwall.config.web

import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Primary
import org.springframework.http.client.ReactorResourceFactory
import reactor.netty.resources.LoopResources

/**
 *
 * @author 思追(shaco)
 */
@Configuration
class WebConfiguration(
    val mainServerProperties: MainServerProperties,
) {

    companion object {
        const val MAIN_REACTOR_RESOURCE_FACTORY_BEAN_NAME = "mainReactorResourceFactory"
        const val CONFIG_REACTOR_RESOURCE_FACTORY_BEAN_NAME = "configReactorResourceFactory"
    }

    /**
     * 主服务资源工厂
     */
    @Primary
    @Bean(MAIN_REACTOR_RESOURCE_FACTORY_BEAN_NAME)
    fun mainReactorResourceFactory(): ReactorResourceFactory {
        // 如果设置的值小于等于0，则回退到处理器
        var ioWorkCount =
            if (mainServerProperties.ioWorkCount <= 0) {
                Runtime.getRuntime().availableProcessors()
            } else {
                mainServerProperties.ioWorkCount
            }
        ioWorkCount = ioWorkCount.coerceAtLeast(4)

        // 最小值为1
        val ioSelectCount = mainServerProperties.ioSelectCount.coerceAtLeast(1)

        val resourceFactory = ReactorResourceFactory()
        resourceFactory.isUseGlobalResources = false
        resourceFactory.setLoopResourcesSupplier {
            LoopResources.create(
                "main",
                ioSelectCount,
                ioWorkCount,
                true
            )
        }
        return resourceFactory
    }

    /**
     * 配置服务资源工厂
     */
    @Bean(CONFIG_REACTOR_RESOURCE_FACTORY_BEAN_NAME)
    fun configReactorResourceFactory(): ReactorResourceFactory {
        val resourceFactory = ReactorResourceFactory()
        resourceFactory.setLoopResourcesSupplier { LoopResources.create("config", 1, true) }
        return resourceFactory
    }

}
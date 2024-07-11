package cc.shacocloud.greatwall.config

import cc.shacocloud.greatwall.config.web.AutoTLSReactiveWebServerApplicationContext
import org.springframework.boot.ApplicationContextFactory
import org.springframework.boot.WebApplicationType
import org.springframework.context.ConfigurableApplicationContext
import org.springframework.core.env.ConfigurableEnvironment
import org.springframework.core.io.support.SpringFactoriesLoader

/**
 * 自定义应用上下文工厂，使用 [AutoTLSReactiveWebServerApplicationContext] 作为上下文对象
 * @author 思追(shaco)
 */
class CustomApplicationContextFactory : ApplicationContextFactory {

    override fun getEnvironmentType(webApplicationType: WebApplicationType): Class<out ConfigurableEnvironment>? {
        return getFromSpringFactories { obj -> obj.getEnvironmentType(webApplicationType) }
    }

    override fun createEnvironment(webApplicationType: WebApplicationType): ConfigurableEnvironment? {
        return getFromSpringFactories { obj -> obj.createEnvironment(webApplicationType) }
    }

    override fun create(webApplicationType: WebApplicationType): ConfigurableApplicationContext {
        return AutoTLSReactiveWebServerApplicationContext()
    }

    private fun <T> getFromSpringFactories(action: (ApplicationContextFactory) -> T?): T? {
        val loadFactories =
            SpringFactoriesLoader.loadFactories(ApplicationContextFactory::class.java, javaClass.classLoader)

        for (candidate: ApplicationContextFactory in loadFactories) {
            val result: T? = action(candidate)
            if (result != null) {
                return result
            }
        }

        return null
    }


}
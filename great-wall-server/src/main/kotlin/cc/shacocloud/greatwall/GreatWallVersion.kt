package cc.shacocloud.greatwall

import org.springframework.boot.env.YamlPropertySourceLoader
import org.springframework.core.env.MutablePropertySources
import org.springframework.core.env.StandardEnvironment
import org.springframework.core.io.ClassPathResource

/**
 * Great Wall 版本
 * @author 思追(shaco)
 */
object GreatWallVersion : StandardEnvironment(MutablePropertySources()) {

    init {
        val sourceLoader = YamlPropertySourceLoader()
        sourceLoader.load("application-greatwall.yaml", ClassPathResource("application-greatwall.yaml"))
            .forEach {
                propertySources.addLast(it)
            }
    }

    val version: String by lazy { getRequiredProperty("great-wall.version") }

}
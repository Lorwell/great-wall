package cc.shacocloud.greatwall.config

import org.springframework.aot.hint.RuntimeHints
import org.springframework.aot.hint.RuntimeHintsRegistrar

/**
 * 注册 native 配置
 * @author 思追(shaco)
 */
class SiteRuntimeHintsRegistrar : RuntimeHintsRegistrar {

    override fun registerHints(hints: RuntimeHints, classLoader: ClassLoader?) {
        requireNotNull(classLoader)

        // sql 文件
        hints.resources().registerPattern("sql/*.sql")

        // 静态资源
        hints.resources().registerPattern("static/*")

        // 配置文件
        hints.resources().registerPattern("config/*")
    }

}


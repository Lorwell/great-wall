package cc.shacocloud.greatwall.utils

import cc.shacocloud.greatwall.config.AutoTLSReactiveWebServerApplicationContext
import org.springframework.context.ApplicationContext
import org.springframework.context.ApplicationContextAware
import org.springframework.stereotype.Component

/**
 * 应用上下文对象持有者
 * @author 思追(shaco)
 */
@Component
class ApplicationContextHolder : ApplicationContextAware {

    companion object {
        private var applicationContext: AutoTLSReactiveWebServerApplicationContext? = null

        /**
         * 获取实例
         */
        fun getInstance(): AutoTLSReactiveWebServerApplicationContext {
            check()
            return applicationContext!!
        }

        /**
         * 是否是可用的
         */
        fun available(): Boolean {
            return applicationContext != null
        }

        private fun check() {
            if (applicationContext == null) {
                throw IllegalStateException("应用未初始化完成，无法使用！")
            }
        }

    }

    override fun setApplicationContext(applicationContext: ApplicationContext) {
        if (applicationContext is AutoTLSReactiveWebServerApplicationContext) {
            ApplicationContextHolder.applicationContext = applicationContext
        }
    }

}
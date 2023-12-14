package cc.shacocloud.greatwall.utils

import org.slf4j.Logger
import org.slf4j.LoggerFactory

/**
 * 类似 lombok 的 @Slf4j 使用方式
 *
 * 在指定类上使用 @Slf4j 注解，即可使用
 */
@Target(AnnotationTarget.CLASS)
@Retention(AnnotationRetention.RUNTIME)
@MustBeDocumented
annotation class Slf4j(

    /**
     * 根据 loggerName 参数命名的 Logger
     */
    val loggerName: String = ""

) {

    companion object {
        val <reified T> T.log: Logger
            inline get() {
                val clazz = T::class.java

                // 如果类上未使用 @Slf4j 注解则默认使用类型加载
                // 如果主动声明了 loggerName 则使用该参数命名
                val slf4j = clazz.getAnnotation(Slf4j::class.java)
                if (slf4j != null && slf4j.loggerName.isNotEmpty()) {
                    return LoggerFactory.getLogger(slf4j.loggerName)
                }

                return LoggerFactory.getLogger(clazz)
            }
    }

}

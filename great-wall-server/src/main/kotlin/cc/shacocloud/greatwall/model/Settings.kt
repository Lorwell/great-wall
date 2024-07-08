package cc.shacocloud.greatwall.model

import java.util.concurrent.atomic.AtomicBoolean

/**
 *
 *  系统设置信息
 * @author 思追(shaco)
 */
object Settings {

    /**
     * 请求是否重定向到 https
     */
    val redirectHttps = AtomicBoolean(false)

}
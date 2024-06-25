package cc.shacocloud.greatwall.config.web

import org.springframework.boot.context.properties.ConfigurationProperties

/**
 *
 * @author 思追(shaco)
 */
@ConfigurationProperties("server.main-server")
data class MainServerProperties(

    /**
     * 非 tls 端口
     */
    val port: Int,

    /**
     * 请求是否重定向到 https
     */
    val redirectHttps: Boolean
)
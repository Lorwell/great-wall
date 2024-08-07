package cc.shacocloud.greatwall.config.web

import org.springframework.boot.context.properties.ConfigurationProperties

/**
 *
 * @author 思追(shaco)
 */
@ConfigurationProperties("server.config-server")
data class ConfigServerProperties(

    /**
     * 端口
     */
    val port: Int,

)
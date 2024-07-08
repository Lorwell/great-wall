package cc.shacocloud.greatwall.config

import org.springframework.boot.context.properties.ConfigurationProperties

/**
 * @author 思追(shaco)
 */
@ConfigurationProperties("site.tls.provider.osfipin")
data class OsfipinProperties(

    /**
     * 基础路由
     */
    val baseUrl: String

)

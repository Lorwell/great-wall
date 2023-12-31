package cc.shacocloud.greatwall.model

import org.springframework.boot.autoconfigure.ssl.SslBundleProperties
import java.util.Date

/**
 * @author 思追(shaco)
 */
data class TlsLoadMo(

    /**
     * ssl 证书的配置属性
     */
    val properties: SslBundleProperties,

    /**
     * 证书过期时间
     */
    val expirationTime: Date

)

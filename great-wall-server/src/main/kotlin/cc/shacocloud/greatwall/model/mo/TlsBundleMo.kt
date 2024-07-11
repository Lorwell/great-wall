package cc.shacocloud.greatwall.model.mo

import org.springframework.boot.autoconfigure.ssl.SslBundleProperties
import java.time.LocalDateTime

/**
 * @author 思追(shaco)
 */
data class TlsBundleMo(

    /**
     * ssl 证书的配置属性
     */
    val properties: SslBundleProperties,

    /**
     * 证书过期时间
     */
    val expirationTime: LocalDateTime?

)

package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.config.OsfipinProperties
import org.springframework.boot.autoconfigure.ssl.SslBundleProperties

/**
 * tls 证书服务接口
 *
 * @author 思追(shaco)
 */
interface TLSService {

    /**
     * 加载证书并且返回配置信息
     */
    fun load(properties: OsfipinProperties): SslBundleProperties

}
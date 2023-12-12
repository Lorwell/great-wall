package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.service.TLSService
import cc.shacocloud.greatwall.service.client.OsfipinClient
import org.springframework.beans.factory.annotation.Value
import org.springframework.stereotype.Service
import org.springframework.util.ResourceUtils

/**
 * 基于 [来此加密](https://letsencrypt.osfipin.com/) 的tls证书服务器实现
 * @author 思追(shaco)
 */
@Service
class LetsencryptTLSServiceImpl(
    @Value("\${spring.ssl.bundle.pem.letsencrypt.keystore.certificate}") var certificatePath: String,
    @Value("\${spring.ssl.bundle.pem.letsencrypt.keystore.private-key}") var privateKeyPath: String,
    val osfipinClient: OsfipinClient
) : TLSService {


    /**
     * 重新加载证书
     */
    override fun reload() {
        val certificatePathFile = ResourceUtils.getFile(certificatePath)
        val privateKeyPathFile = ResourceUtils.getFile(privateKeyPath)

//        osfipinClient.download()
    }
}
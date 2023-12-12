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

        // 下载证书，并且读取指定文件写入指定地点
        osfipinClient.download().use { zipFile ->
            val fullchainZipEntry = zipFile.getEntry("fullchain.crt")
            zipFile.getInputStream(fullchainZipEntry).use { input ->
                certificatePathFile.outputStream().use { output ->
                    input.copyTo(output)
                }
            }

            val privatePemZipEntry = zipFile.getEntry("private.pem")
            zipFile.getInputStream(privatePemZipEntry).use { input ->
                privateKeyPathFile.outputStream().use { output ->
                    input.copyTo(output)
                }
            }
        }
    }
}
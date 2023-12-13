package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.config.OsfipinProperties
import cc.shacocloud.greatwall.service.TLSService
import cc.shacocloud.greatwall.service.client.OsfipinClient
import cc.shacocloud.greatwall.service.client.impl.OsfipinClientImpl
import org.springframework.util.ResourceUtils

/**
 * 基于 [来此加密](https://letsencrypt.osfipin.com/) 的tls证书服务器实现
 * @author 思追(shaco)
 */
class LetsencryptTLSServiceImpl : TLSService {

    private val osfipinClient: OsfipinClient = OsfipinClientImpl(
        OsfipinProperties(
            baseUrl = "",
            token = "",
            user = "",
            autoId = ""
        )
    )

    /**
     * 重新加载证书
     */
    override fun reload() {
        val certificatePathFile = ResourceUtils.getFile(" ")
        val privateKeyPathFile = ResourceUtils.getFile("")

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
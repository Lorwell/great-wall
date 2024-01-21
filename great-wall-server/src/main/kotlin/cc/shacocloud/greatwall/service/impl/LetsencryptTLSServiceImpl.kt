package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.model.TlsLoadMo
import cc.shacocloud.greatwall.service.TLSService
import cc.shacocloud.greatwall.service.client.OsfipinClient
import cc.shacocloud.greatwall.utils.createOfNotExist
import org.springframework.boot.autoconfigure.ssl.PemSslBundleProperties
import org.springframework.stereotype.Service
import java.io.File

/**
 * 基于 [来此加密](https://letsencrypt.osfipin.com/) 的tls证书服务器实现
 * @author 思追(shaco)
 */
@Service
class LetsencryptTLSServiceImpl(
    val osfipinClient: OsfipinClient
) : TLSService {

    companion object {
        // 证书文件存储的父文件夹
        private val filesParent = "${System.getProperty("user.dir")}/.runtimeData/tls/letsencrypt/osfipin"
    }

    /**
     * 重新加载证书
     */
    override fun load(): TlsLoadMo {
        val certificatePathFile = File(filesParent, "certificate.crt").createOfNotExist()
        val privateKeyPathFile = File(filesParent, "private.pem").createOfNotExist()

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

        // 封装为证书的配置
        val sslProperties = PemSslBundleProperties().apply {
            keystore.apply {
                certificate = certificatePathFile.absolutePath
                privateKey = privateKeyPathFile.absolutePath
            }
        }


        // 获取当前证书的过期时间
        val certificateDetail = osfipinClient.currentDomainCertificateDetail()
        val expirationTime = certificateDetail.v.timeEnd

        return TlsLoadMo(
            properties = sslProperties,
            expirationTime = expirationTime
        )
    }
}
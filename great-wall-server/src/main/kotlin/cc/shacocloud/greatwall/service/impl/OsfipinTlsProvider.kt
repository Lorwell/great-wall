package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.model.mo.CustomTlsConfig
import cc.shacocloud.greatwall.model.mo.OsfipinTlsConfig
import cc.shacocloud.greatwall.model.mo.TlsConfig
import cc.shacocloud.greatwall.model.mo.TlsFile
import cc.shacocloud.greatwall.service.TlsProvider
import cc.shacocloud.greatwall.service.client.OsfipinClient
import org.springframework.stereotype.Service
import kotlin.io.path.outputStream

/**
 * 来此加密证书提供者
 *
 * https://letsencrypt.osfipin.com/
 *
 * @author 思追(shaco)
 */
@Service
class OsfipinTlsProvider(
    val osfipinClient: OsfipinClient,
) : TlsProvider {

    override fun supports(config: TlsConfig): Boolean {
        return config is OsfipinTlsConfig
    }

    override suspend fun getLatestTls(config: TlsConfig, tlsFile: TlsFile) {
        val conf = config as OsfipinTlsConfig
        val (certificatePath, privateKeyPath) = tlsFile

        osfipinClient.download(conf).use { zipFile ->
            val fullchainZipEntry = zipFile.getEntry("fullchain.crt")
            zipFile.getInputStream(fullchainZipEntry).use { input ->
                certificatePath.outputStream().use { output ->
                    input.copyTo(output)
                }
            }

            val privatePemZipEntry = zipFile.getEntry("private.pem")
            zipFile.getInputStream(privatePemZipEntry).use { input ->
                privateKeyPath.outputStream().use { output ->
                    input.copyTo(output)
                }
            }
        }
    }

}

package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.model.mo.CustomTlsConfig
import cc.shacocloud.greatwall.model.mo.TlsConfig
import cc.shacocloud.greatwall.model.mo.TlsFile
import cc.shacocloud.greatwall.service.TlsProvider
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.withContext
import org.springframework.stereotype.Service
import java.nio.file.Files

/**
 * 自定义证书提供者
 * @author 思追(shaco)
 */
@Service
class CustomTlsProvider : TlsProvider {

    override fun supports(config: TlsConfig): Boolean {
        return config is CustomTlsConfig
    }

    override suspend fun getLatestTls(config: TlsConfig, tlsFile: TlsFile) {
        val conf = config as CustomTlsConfig
        val (certificatePath, privateKeyPath) = tlsFile

        withContext(Dispatchers.IO) {
            Files.writeString(certificatePath, conf.certificate)
            Files.writeString(privateKeyPath, conf.privateKey)
        }
    }
}
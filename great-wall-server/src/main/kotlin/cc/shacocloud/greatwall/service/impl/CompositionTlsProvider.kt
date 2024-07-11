package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.model.mo.TlsConfig
import cc.shacocloud.greatwall.model.mo.TlsFile
import cc.shacocloud.greatwall.service.TlsProvider
import org.springframework.beans.factory.ObjectProvider
import org.springframework.stereotype.Service

/**
 * 组合服务
 * @author 思追(shaco)
 */
@Service
class CompositionTlsProvider(
    tlsProviderObjectProvider: ObjectProvider<TlsProvider>
) {

    val tlsProviders = tlsProviderObjectProvider.iterator().asSequence().toList()

    /**
     * 聚会证书提供者实现不同类型的转发
     */
    suspend fun getLatestTls(config: TlsConfig, tlsFile: TlsFile) {
        for (tlsProvider in tlsProviders) {
            if (tlsProvider.supports(config)) {
                return tlsProvider.getLatestTls(config, tlsFile)
            }
        }
    }

}
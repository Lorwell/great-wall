package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.model.mo.TlsConfig
import cc.shacocloud.greatwall.model.mo.TlsFile

/**
 * 证书提供者
 * @author 思追(shaco)
 */
interface TlsProvider {

    /**
     * 是否支持
     */
    fun supports(config: TlsConfig): Boolean

    /**
     * 获取最新的证书
     *
     * @param config 证书配置
     * @param tlsFile 证书文件
     */
    suspend fun getLatestTls(
        config: TlsConfig,
        tlsFile: TlsFile
    )

}
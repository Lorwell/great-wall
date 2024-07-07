package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.model.TlsLoadMo
import cc.shacocloud.greatwall.model.dto.input.TlsInput
import cc.shacocloud.greatwall.model.po.TlsPo
import java.time.LocalDateTime
import java.util.zip.ZipFile

/**
 * tls 证书服务接口
 *
 * @author 思追(shaco)
 */
interface TlsService {

    /**
     * 加载证书并且返回配置信息
     */
    suspend fun load(): TlsLoadMo?

    /**
     * 查询证书信息
     */
    suspend fun findTlsPo(): TlsPo?

    /**
     * 更新证书
     */
    suspend fun update(input: TlsInput): TlsPo

    /**
     * 刷新证书
     */
    suspend fun refresh()

    /**
     * 获取证书过期时间
     */
    suspend fun getTlsExpiredTime(): LocalDateTime?

    /**
     * 生成 zip 文件
     */
    suspend fun genZipFile(): ZipFile


}
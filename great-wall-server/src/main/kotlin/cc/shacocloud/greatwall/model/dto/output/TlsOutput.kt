package cc.shacocloud.greatwall.model.dto.output

import cc.shacocloud.greatwall.model.mo.CustomTlsConfig
import cc.shacocloud.greatwall.model.mo.OsfipinTlsConfig
import cc.shacocloud.greatwall.model.mo.TlsConfig
import cc.shacocloud.greatwall.model.po.TlsPo
import java.time.LocalDateTime
import java.util.Date

/**
 *
 * @author 思追(shaco)
 */
data class TlsOutput(

    /**
     * 主键id
     */
    val id: Long,

    /**
     * 证书配置
     */
    val config: TlsConfig,

    /**
     * 过期时间
     */
    val expiredTime: Date?,

    /**
     * 创建时间
     */
    val createTime: Date,

    /**
     * 最后更新时间
     */
    val lastUpdateTime: Date

) {

    companion object {

        fun TlsPo.toOutput(): TlsOutput {
            return TlsOutput(
                id = id!!,
                config = config.toSafe(),
                expiredTime = expiredTime,
                createTime = createTime,
                lastUpdateTime = lastUpdateTime
            )
        }

        /**
         * 转为安全的配置输出
         */
        fun TlsConfig.toSafe(): TlsConfig {

            when (this) {
                is CustomTlsConfig -> {
                    return CustomTlsConfig(
                        certificate = certificate,
                        privateKey = "************"
                    )
                }

                is OsfipinTlsConfig -> {
                    return OsfipinTlsConfig(
                        token = token,
                        user = user,
                        autoId = autoId
                    )
                }
            }
            return this
        }
    }
}

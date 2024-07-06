package cc.shacocloud.greatwall.model.dto.output

import cc.shacocloud.greatwall.model.mo.TlsConfig
import jakarta.validation.Valid
import jakarta.validation.constraints.NotNull
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

)

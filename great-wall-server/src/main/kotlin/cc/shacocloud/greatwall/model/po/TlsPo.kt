package cc.shacocloud.greatwall.model.po

import cc.shacocloud.greatwall.model.constant.TlsTypeEnum
import cc.shacocloud.greatwall.model.mo.TlsConfig
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.util.*

/**
 * 证书管理
 * @author 思追(shaco)
 */
@Table("app_tls")
data class TlsPo(

    @Id
    @Column("id")
    val id: Long? = null,

    /**
     * 固定的key 唯一，便于控制
     */
    @Column("uk_key")
    var key: String = TLS_KEY,

    /**
     * 证书类型
     */
    @Column("type")
    var type: TlsTypeEnum,

    /**
     * 证书配置
     */
    @Column("config")
    var config: TlsConfig,

    /**
     * 过期时间
     */
    @Column("expired_time")
    var expiredTime: Date?,

    /**
     * 创建时间
     */
    @Column("create_time")
    val createTime: Date,

    /**
     * 最后更新时间
     */
    @Column("last_update_time")
    var lastUpdateTime: Date

) {

    companion object {
        const val TLS_KEY = "app_tls"
    }

}
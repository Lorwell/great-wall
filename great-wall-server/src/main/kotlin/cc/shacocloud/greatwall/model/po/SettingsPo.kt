package cc.shacocloud.greatwall.model.po

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.util.*

/**
 * 系统设置
 * @author 思追(shaco)
 */
@Table("settings")
data class SettingsPo(

    @Id
    @Column("id")
    val id: Long? = null,

    /**
     * 设置的键
     */
    @Column("settings_name")
    val name: String,

    /**
     * 设置的值
     */
    @Column("settings_value")
    var value: String?,

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

)
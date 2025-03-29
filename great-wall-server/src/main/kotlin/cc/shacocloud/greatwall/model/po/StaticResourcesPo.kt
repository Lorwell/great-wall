package cc.shacocloud.greatwall.model.po

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime
import java.util.Date

/**
 * 静态资源配置
 * @author 思追(shaco)
 */
@Table("static_resources")
data class StaticResourcesPo(

    @Id
    @Column("id")
    val id: Long? = null,

    /**
     * 名称
     */
    @Column("name")
    var name: String,

    /**
     * 描述
     */
    @Column("describe")
    var describe: String? = null,

    /**
     * 唯一id，用于区分不同的资源文件
     */
    @Column("unique_id")
    val uniqueId: String,

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
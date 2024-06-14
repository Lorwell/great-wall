package cc.shacocloud.greatwall.model.po

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table

/**
 * 基于数据库缓存模型
 * @author 思追(shaco)
 */
@Table("cache")
class CachePo(

    @Id
    @Column("id")
    val id: Long? = null,

    /**
     * 缓存名称
     */
    @Column("name")
    val name: String,

    /**
     * 缓存的唯一键
     */
    @Column("cache_key")
    val cacheKey: String,

    /**
     * 缓存的唯一键
     */
    @Column("cache_value")
    var cacheValue: String,

    /**
     * 过期时间
     */
    @Column("expiration_time")
    var expirationTime: Long

)
package cc.shacocloud.greatwall.model.po

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.mo.RouteFilters
import cc.shacocloud.greatwall.model.mo.RoutePredicates
import cc.shacocloud.greatwall.model.mo.RouteTargetConfig
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import java.time.LocalDateTime
import java.util.*

/**
 * 应用路由模型
 * @author 思追(shaco)
 */
@Table("app_route")
data class AppRoutePo(

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
     * 优先级，值越高优先级越低，反之优先级越高
     */
    @Column("priority")
    var priority: Int,

    /**
     * 状态
     */
    @Column("status")
    var status: AppRouteStatusEnum,

    /**
     * 目标地址配置
     */
    @Column("target_config")
    var targetConfig: RouteTargetConfig,

    /**
     * 路由条件
     */
    @Column("predicates")
    var predicates: RoutePredicates,

    /**
     * 路由过滤器插件
     */
    @Column("filters")
    var filters: RouteFilters,

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

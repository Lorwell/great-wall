package cc.shacocloud.greatwall.model.po

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.constant.RoutePredicateOperatorEnum
import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
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
     * 应用唯一id
     */
    @Column("app_id")
    val appId: String,

    /**
     * 请求地址
     */
    @Column("uri")
    var uri: String,

    /**
     * 优先级，值越高优先级越低，反之优先级越高
     */
    @Column("`order`")
    var order: Int,

    /**
     * 路由条件
     */
    @Column("predicates")
    var predicates: RoutePredicates,

    /**
     * 状态
     */
    @Column("status")
    var status: AppRouteStatusEnum,

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

    class RoutePredicates : ArrayList<RoutePredicateOperator>()

    /**
     * 路由条件
     */
    data class RoutePredicateOperator(
        val operator: RoutePredicateOperatorEnum,
        val predicate: RoutePredicate
    )

    /**
     * 路由条件
     */
    data class RoutePredicate(
        val name: String,
        val args: Map<String, Any>
    )

}

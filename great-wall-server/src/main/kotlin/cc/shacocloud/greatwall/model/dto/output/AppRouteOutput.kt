package cc.shacocloud.greatwall.model.dto.output

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.mo.RoutePredicates
import cc.shacocloud.greatwall.model.mo.RouteUrl
import cc.shacocloud.greatwall.model.mo.RouteUrls
import java.util.*

/**
 *
 * @author 思追(shaco)
 */
data class AppRouteOutput(

    /**
     * 主键id
     */
    val id: Long,

    /**
     * 名称
     */
    val name: String,

    /**
     * 描述
     */
    val describe: String? = null,

    /**
     * 优先级，值越高优先级越低，反之优先级越高
     */
    val priority: Int,

    /**
     * 状态
     */
    val status: AppRouteStatusEnum,

    /**
     * 请求地址
     */
    val urls: RouteUrls,

    /**
     * 路由条件
     */
    val predicates: RoutePredicates,

    /**
     * 创建时间
     */
    val createTime: Date,

    /**
     * 最后更新时间
     */
    val lastUpdateTime: Date

)

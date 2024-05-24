package cc.shacocloud.greatwall.model.mo

import java.net.URI

/**
 * 基础路由信息
 * @author 思追(shaco)
 */
data class BaseRouteInfo(
    val routeId: String,
    val uri: URI,
    val order: Int = 0
)
package cc.shacocloud.greatwall.model.constant

import org.springframework.cloud.gateway.filter.factory.GatewayFilterFactory

/**
 * 路由过滤器
 *
 * @author 思追(shaco)
 */
enum class RouteFilterEnum(
    val factoryClass: Class<out GatewayFilterFactory<out Any>>,
) {
}
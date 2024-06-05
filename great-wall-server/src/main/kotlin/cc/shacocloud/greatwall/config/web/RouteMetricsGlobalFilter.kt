package cc.shacocloud.greatwall.config.web

import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
import org.springframework.cloud.gateway.route.Route
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils
import org.springframework.core.Ordered
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

/**
 * 路由指标过滤器，用于记录匹配成功的路由对象 [Route]
 *
 * @author 思追(shaco)
 */
@Component
class RouteMetricsGlobalFilter : GlobalFilter, Ordered {

    companion object {

        /**
         * 路由信息
         */
        val ROUTE_ATTR = "${RouteMetricsGlobalFilter::class.java}.route"

    }

    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        val route = exchange.getAttribute<Route>(ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR)

        if (route != null) {
            exchange.attributes[ROUTE_ATTR] = route
        }

        return chain.filter(exchange)
    }

    override fun getOrder(): Int {
        return Ordered.HIGHEST_PRECEDENCE
    }

}
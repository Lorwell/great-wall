package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.model.mo.BaseRouteInfo
import cc.shacocloud.greatwall.model.mo.RoutePredicate
import org.springframework.cloud.gateway.handler.AsyncPredicate
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils
import org.springframework.web.server.ServerWebExchange
import java.util.function.Predicate

/**
 * 路由条件工厂
 * @author 思追(shaco)
 */
interface RoutePredicateFactory {

    /**
     * 配置转为 [Predicate<ServerWebExchange>]
     */
    suspend fun predicate(
        config: RoutePredicate,
        baseInfo: BaseRouteInfo
    ): Predicate<ServerWebExchange>

    /**
     * 配置转为 异步的 [AsyncPredicate<ServerWebExchange>]
     */
    suspend fun asyncPredicate(
        config: RoutePredicate,
        baseInfo: BaseRouteInfo
    ): AsyncPredicate<ServerWebExchange> {
        return ServerWebExchangeUtils.toAsyncPredicate(predicate(config, baseInfo))
    }

}
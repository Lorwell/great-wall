package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.constant.RoutePredicateOperatorEnum.AND
import cc.shacocloud.greatwall.model.constant.RoutePredicateOperatorEnum.OR
import cc.shacocloud.greatwall.model.mo.BaseRouteInfo
import cc.shacocloud.greatwall.utils.ApplicationContextHolder
import kotlinx.coroutines.reactor.flux
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.cloud.gateway.event.RefreshRoutesEvent
import org.springframework.cloud.gateway.filter.GatewayFilter
import org.springframework.cloud.gateway.filter.OrderedGatewayFilter
import org.springframework.cloud.gateway.filter.factory.GatewayFilterFactory
import org.springframework.cloud.gateway.handler.predicate.WeightRoutePredicateFactory
import org.springframework.cloud.gateway.route.Route
import org.springframework.cloud.gateway.route.RouteLocator
import org.springframework.cloud.gateway.support.RouteMetadataUtils
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils
import org.springframework.context.annotation.DependsOn
import org.springframework.core.Ordered
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import java.net.URI
import java.util.concurrent.atomic.AtomicBoolean

/**
 * 应用路由加载器
 *
 * @author 思追(shaco)
 */
@Service
@DependsOn("upgradeScript")
class AppRouteLocator(
    val appRouteService: AppRouteService,
    val routePredicateFactory: RoutePredicateFactory,
    val weightRoutePredicateFactory: WeightRoutePredicateFactory,
    val gatewayFilters: List<GatewayFilterFactory<*>>,
) : RouteLocator {


    companion object {

        val APP_ROUTE_ID_META_KEY = "${AppRouteLocator::class.java}.appRouteId"

        private val log: Logger = LoggerFactory.getLogger(AppRouteLocator::class.java)

        /**
         * 刷新路由
         */
        fun refreshRoutes() {
            ApplicationContextHolder.getInstance().publishEvent(RefreshRoutesEvent(this))
        }

        /**
         * 添加过滤器
         */
        fun Route.AsyncBuilder.addFilter(gatewayFilter: GatewayFilter): Route.AsyncBuilder {
            if (gatewayFilter is Ordered) {
                return filter(gatewayFilter)
            }
            return filter(OrderedGatewayFilter(gatewayFilter, 0))
        }

    }

    /**
     * 加载所有数据库中路由
     */
    override fun getRoutes(): Flux<Route> = flux {
        if (log.isInfoEnabled) {
            log.info("刷新路由...")
        }

        appRouteService.findByStatus(AppRouteStatusEnum.ONLINE)
            .forEach { appRoute ->
                val id = appRoute.id!!
                val targetConfig = appRoute.targetConfig
                val routeUrls = targetConfig.urls
                val isSingleton = routeUrls.size == 1

                for ((index, url) in routeUrls.withIndex()) {
                    val uri = URI.create(url.url)

                    val appId = "${id}-${index}"

                    val routeBuilder = Route.async()
                        .id(appId)
                        .uri(uri)
                        .order(appRoute.priority)
                        .metadata(APP_ROUTE_ID_META_KEY, id)
                        // 链接超时
                        .metadata(
                            RouteMetadataUtils.CONNECT_TIMEOUT_ATTR,
                            targetConfig.connectTimeout.toMillis()
                        )
                        // 响应超时
                        .metadata(
                            RouteMetadataUtils.RESPONSE_TIMEOUT_ATTR,
                            targetConfig.responseTimeout?.toMillis() ?: -1
                        )

                    // 如果目标地址存在多个则绑定权重路由条件
                    val first = if (isSingleton) {
                        AtomicBoolean(true)
                    } else {
                        routeBuilder.and(
                            ServerWebExchangeUtils.toAsyncPredicate(
                                weightRoutePredicateFactory.apply {
                                    it.routeId = appId
                                    it.group = "appRoute-${id}"
                                    it.weight = url.weight
                                }
                            )
                        )
                        AtomicBoolean(false)
                    }

                    val baseInfo = BaseRouteInfo(appId, uri, appRoute.priority)

                    // 路由条件
                    appRoute.predicates
                        .map {
                            it.operator to routePredicateFactory.asyncPredicate(it.predicate, baseInfo)
                        }
                        .forEach { (operator, predicate) ->
                            if (first.getAndSet(false)) {
                                routeBuilder.asyncPredicate(predicate)
                            } else {
                                when (operator) {
                                    AND -> routeBuilder.and(predicate)
                                    OR -> routeBuilder.or(predicate)
                                }
                            }
                        }

                    // 插件配置
                    for (filter in appRoute.filters) {
                        val gatewayFilter = findGatewayFilter(filter.type.factoryClass)
                            .apply { config -> filter.fillConfig(config) }
                        routeBuilder.addFilter(gatewayFilter)
                    }

                    send(routeBuilder.build())
                }
            }
    }

    @Suppress("UNCHECKED_CAST")
    fun <C : GatewayFilterFactory<out Any>> findGatewayFilter(factoryClass: Class<C>): C {
        val factory = gatewayFilters.find { factoryClass.isAssignableFrom(it::class.java) } as C?
        if (factory == null) {
            throw IllegalArgumentException("未能匹配到 $factoryClass 对应的网关过滤器工厂")
        }
        return factory
    }

}
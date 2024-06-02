package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.constant.RoutePredicateOperatorEnum.AND
import cc.shacocloud.greatwall.model.constant.RoutePredicateOperatorEnum.OR
import cc.shacocloud.greatwall.model.mo.BaseRouteInfo
import cc.shacocloud.greatwall.utils.ApplicationContextHolder
import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import kotlinx.coroutines.reactor.flux
import org.springframework.cloud.gateway.event.RefreshRoutesEvent
import org.springframework.cloud.gateway.handler.predicate.WeightRoutePredicateFactory
import org.springframework.cloud.gateway.route.Route
import org.springframework.cloud.gateway.route.RouteLocator
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import java.net.URI
import java.util.concurrent.atomic.AtomicBoolean

/**
 * 应用路由加载器
 *
 * @author 思追(shaco)
 */
@Slf4j
@Service
class AppRouteLocator(
    val appRouteService: AppRouteService,
    val routePredicateFactory: RoutePredicateFactory,
    val weightRoutePredicateFactory: WeightRoutePredicateFactory
) : RouteLocator {

    companion object {

        /**
         * 刷新路由
         */
        fun refreshRoutes() {
            ApplicationContextHolder.getInstance().publishEvent(RefreshRoutesEvent(this))
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
                val routeUrls = appRoute.urls
                val isSingleton = routeUrls.size == 1

                for ((index, url) in routeUrls.withIndex()) {
                    val uri = URI.create(url.url)

                    val appId = "${id}-${index}"

                    val routeBuilder = Route.async()
                        .id(appId)
                        .uri(uri)
                        .order(appRoute.priority)

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

                    // 插件配置 TODO

                    send(routeBuilder.build())
                }
            }
    }

}
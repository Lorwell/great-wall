package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.constant.RoutePredicateOperatorEnum.AND
import cc.shacocloud.greatwall.model.constant.RoutePredicateOperatorEnum.OR
import cc.shacocloud.greatwall.model.mo.BaseRouteInfo
import cc.shacocloud.greatwall.repository.AppRouteRepository
import cc.shacocloud.greatwall.service.AppRouteService
import cc.shacocloud.greatwall.service.RoutePredicateFactory
import cc.shacocloud.greatwall.utils.ApplicationContextHolder
import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import kotlinx.coroutines.reactor.flux
import org.springframework.cloud.gateway.event.RefreshRoutesEvent
import org.springframework.cloud.gateway.route.Route
import org.springframework.cloud.gateway.route.RouteLocator
import org.springframework.cloud.gateway.route.builder.RouteLocatorBuilder
import org.springframework.stereotype.Service
import reactor.core.publisher.Flux
import java.net.URI
import java.util.concurrent.atomic.AtomicBoolean

/**
 *
 * @author 思追(shaco)
 */
@Slf4j
@Service
class AppRouteServiceImpl(
    val appRouteRepository: AppRouteRepository,
    val routePredicateFactory: RoutePredicateFactory
) : AppRouteService, RouteLocator {

    /**
     * 加载所有数据库中路由
     */
    override fun getRoutes(): Flux<Route> {
        return flux {
            appRouteRepository.findByStatus(AppRouteStatusEnum.ONLINE)
                .forEach { appRoute ->
                    appRoute.uris.forEach { uriStr ->
                        val uri = URI.create(uriStr)

                        val routeBuilder = Route.async()
                            .id(appRoute.appId)
                            .uri(uri)
                            .order(appRoute.priority)

                        val first = AtomicBoolean(true)

                        val baseInfo = BaseRouteInfo(appRoute.appId, uri, appRoute.priority)

                        // 条件
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

                        routeBuilder.filters()

                        send(routeBuilder.build())
                    }
                }
        }
    }

    /**
     * 刷新路由
     */
    override fun refreshRoutes() {
        if (log.isInfoEnabled) {
            log.info("刷新路由...")
        }

        ApplicationContextHolder.getInstance().publishEvent(RefreshRoutesEvent(this))
    }

}
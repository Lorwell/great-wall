package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.model.mo.BaseRouteInfo
import cc.shacocloud.greatwall.model.mo.RoutePredicate
import cc.shacocloud.greatwall.service.RoutePredicateFactory
import cc.shacocloud.greatwall.utils.ApplicationContextHolder
import org.springframework.beans.BeanUtils
import org.springframework.beans.BeansException
import org.springframework.stereotype.Service
import org.springframework.web.server.ServerWebExchange
import java.util.function.Predicate

/**
 *
 * @author 思追(shaco)
 */
@Service
class RoutePredicateFactoryImpl : RoutePredicateFactory {


    /**
     * 配置转为 [Predicate<ServerWebExchange>]
     */
    override suspend fun predicate(config: RoutePredicate, baseInfo: BaseRouteInfo): Predicate<ServerWebExchange> {

        val routePredicateFactory = try {
            ApplicationContextHolder.getInstance().getBean(config.type.factoryClass)
        } catch (e: BeansException) {
            BeanUtils.instantiateClass(config.type.factoryClass)
        }

        return routePredicateFactory.apply { config.fillConfig(it, baseInfo) }
    }


}
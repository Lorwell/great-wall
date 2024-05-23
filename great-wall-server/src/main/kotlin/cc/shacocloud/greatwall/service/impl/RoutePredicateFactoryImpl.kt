package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.model.po.AppRoutePo
import cc.shacocloud.greatwall.service.RoutePredicateFactory
import org.springframework.stereotype.Service
import org.springframework.web.server.ServerWebExchange
import java.util.function.Predicate

/**
 *
 * @author 思追(shaco)
 */
@Service
class RoutePredicateFactoryImpl : RoutePredicateFactory {

    override suspend fun predicate(config: AppRoutePo.RoutePredicate): Predicate<ServerWebExchange> {
        TODO("Not yet implemented")
    }

}
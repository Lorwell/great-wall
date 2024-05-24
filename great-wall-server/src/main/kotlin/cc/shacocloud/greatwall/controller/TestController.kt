package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.constant.RoutePredicateOperatorEnum
import cc.shacocloud.greatwall.model.mo.RoutePathPredicate
import cc.shacocloud.greatwall.model.mo.RoutePredicateOperator
import cc.shacocloud.greatwall.model.mo.RoutePredicates
import cc.shacocloud.greatwall.model.po.AppRoutePo
import cc.shacocloud.greatwall.repository.AppRouteRepository
import cc.shacocloud.greatwall.service.AppRouteService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RestController
import java.util.*

/**
 *
 * @author 思追(shaco)
 */
@RestController
class TestController(
    val appRouteRepository: AppRouteRepository,
    val appRouteService: AppRouteService
) {

    @GetMapping("/test")
    suspend fun test(): String {
        return "hello world"
    }

    @GetMapping("/reloadConfig")
    suspend fun reloadConfig(): String {
        val routePredicates = RoutePredicates()

        routePredicates.add(
            RoutePredicateOperator(
                operator = RoutePredicateOperatorEnum.AND,
                predicate = RoutePathPredicate(
                    patterns = listOf("/test2")
                )
            )
        )

        val appId = "test1"
        val appRoutePo = appRouteRepository.findByAppId(appId)?.apply {
            uri = "https://mirage.shacocloud.cc"
            appOrder = 0
            predicates = routePredicates
            status = AppRouteStatusEnum.ONLINE
            lastUpdateTime = Date()
        } ?: AppRoutePo(
            appId = "test1",
            uri = "https://mirage.shacocloud.cc",
            appOrder = 0,
            predicates = routePredicates,
            status = AppRouteStatusEnum.ONLINE,
            createTime = Date(),
            lastUpdateTime = Date()
        )

        appRouteRepository.save(appRoutePo)
        appRouteService.refreshRoutes()
        return "ok"
    }

}
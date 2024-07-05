package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.config.R2dbcConfiguration.Companion.bindByName
import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.constant.RoutePredicateOperatorEnum.AND
import cc.shacocloud.greatwall.model.constant.RoutePredicateOperatorEnum.OR
import cc.shacocloud.greatwall.model.mo.BaseRouteInfo
import cc.shacocloud.greatwall.model.mo.RouteTargetConfig
import cc.shacocloud.greatwall.model.mo.RouteUrl
import cc.shacocloud.greatwall.utils.ApplicationContextHolder
import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import cc.shacocloud.greatwall.utils.json.Json
import com.fasterxml.jackson.core.type.TypeReference
import io.r2dbc.spi.Readable
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.flux
import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.InitializingBean
import org.springframework.cloud.gateway.event.RefreshRoutesEvent
import org.springframework.cloud.gateway.filter.factory.GatewayFilterFactory
import org.springframework.cloud.gateway.handler.predicate.WeightRoutePredicateFactory
import org.springframework.cloud.gateway.route.Route
import org.springframework.cloud.gateway.route.RouteLocator
import org.springframework.cloud.gateway.support.RouteMetadataUtils
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils
import org.springframework.r2dbc.core.DatabaseClient
import org.springframework.r2dbc.core.await
import org.springframework.r2dbc.core.awaitOne
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
    val weightRoutePredicateFactory: WeightRoutePredicateFactory,
    gatewayFilterFactories: List<GatewayFilterFactory<Any>>,
    val databaseClient: DatabaseClient
) : RouteLocator, InitializingBean {

    /**
     * 以网关的 [GatewayFilterFactory.name] 作为键，转为一个 map 对象，用于快速匹配
     */
    private val gatewayFilterFactoryMap = gatewayFilterFactories.associateBy { it.name() }

    companion object {

        val APP_ROUTE_ID_META_KEY = "${AppRouteLocator::class.java}.appRouteId"

        /**
         * 刷新路由
         */
        fun refreshRoutes() {
            ApplicationContextHolder.getInstance().publishEvent(RefreshRoutesEvent(this))
        }
    }

    // 修改表结构临时写的逻辑
    override fun afterPropertiesSet() {
        runBlocking {

            var exists = databaseClient.sql(
                """
            SELECT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'APP_ROUTE' AND COLUMN_NAME = 'TARGET_CONFIG' )
        """.trimIndent()
            )
                .map { readable: Readable -> readable.get(0) as Boolean }
                .awaitOne()

            if (!exists) {
                databaseClient.sql(
                    """
                ALTER TABLE app_route ADD COLUMN target_config LONGTEXT NOT NULL default ''
            """.trimIndent()
                )
                    .await()
            }

            exists = databaseClient.sql(
                """
            SELECT EXISTS (SELECT 1 FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = 'APP_ROUTE' AND COLUMN_NAME = 'URLS' )
        """.trimIndent()
            )
                .map { readable: Readable -> readable.get(0) as Boolean }
                .awaitOne()


            if (exists) {
                databaseClient.sql(
                    """
                    SELECT id, urls FROM app_route
                """.trimIndent()
                )
                    .map { readable: Readable -> readable.get(0) as Long to readable.get(1) as String }
                    .all()
                    .collectList()
                    .awaitSingle()
                    .forEach { (id, urls) ->
                        val routeUrls = Json.mapper().readValue(urls, object : TypeReference<ArrayList<RouteUrl>>() {})
                        val config = RouteTargetConfig(
                            urls = routeUrls,
                        )

                        databaseClient.sql(
                            """
                            UPDATE app_route SET target_config = :target_config WHERE id = :id
                        """.trimIndent()
                        )
                            .bindByName("id", id)
                            .bindByName("target_config", Json.encode(config))
                            .await()
                    }

                databaseClient.sql(
                    """
                    ALTER TABLE app_route DROP COLUMN urls
                """.trimIndent()
                )
                    .await()
            }
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
                    // TODO 这边先固定一部分插件

                    // 转发请求头网关过滤器
                    val preserveHostHeaderGatewayFilter =
                        gatewayFilterFactoryMap["PreserveHostHeader"]!!.apply { }
                    routeBuilder.filter(preserveHostHeaderGatewayFilter)

                    send(routeBuilder.build())
                }
            }
    }

}
package cc.shacocloud.greatwall.config.web

import cc.shacocloud.greatwall.model.po.RouteMetricsRecordPo
import cc.shacocloud.greatwall.service.AppRouteLocator
import cc.shacocloud.greatwall.service.MonitorMetricsService
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import cc.shacocloud.greatwall.utils.getHost
import cc.shacocloud.greatwall.utils.getRealIp
import io.questdb.std.Os
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.springframework.cloud.gateway.route.Route
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebHandler
import org.springframework.web.server.handler.WebHandlerDecorator
import reactor.core.publisher.Mono

/**
 * 监控路由指标 web 处理器
 *
 * @author 思追(shaco)
 */
class MonitorRouteMetricsWebHandler(
    webHandler: WebHandler,
    private val monitorMetricsService: MonitorMetricsService
) : WebHandlerDecorator(webHandler) {

    override fun handle(exchange: ServerWebExchange): Mono<Void> {
        val requestTime = Os.currentTimeMicros()

        return delegate.handle(exchange)
            .doOnSuccess { filterCompleteCallback(exchange, requestTime) }
            .doOnError { filterCompleteCallback(exchange, requestTime) }
    }

    /**
     * 过滤器完成回调
     */
    private fun filterCompleteCallback(exchange: ServerWebExchange, requestTime: Long) {
        val response = exchange.response
        val route = exchange.attributes.remove(RouteMetricsGlobalFilter.ROUTE_ATTR) as Route?

        if (response.isCommitted) {
            metricsRecordCommit(exchange, requestTime, route)
        } else {
            response.beforeCommit {
                metricsRecordCommit(exchange, requestTime, route)
                Mono.empty()
            }
        }
    }

    /**
     * 指标记录提交
     */
    private fun metricsRecordCommit(
        exchange: ServerWebExchange,
        requestTime: Long,
        route: Route?
    ) {
        try {
            val request = exchange.request
            val response = exchange.response
            val path = request.path

            // 路由信息
            val appRouteId = route?.metadata?.get(AppRouteLocator.APP_ROUTE_ID_META_KEY) as Long?
            val targetUrl = route?.uri?.toASCIIString()

            // 查询参数
            val queryParamsMetrics = request.queryParams
                .map { it.key to it.value }.toMap(RouteMetricsRecordPo.QueryParamsMetrics())

            val metricsRecord = RouteMetricsRecordPo(
                ip = request.getRealIp(),
                host = request.getHost(),
                method = request.method.name(),
                appPath = path.pathWithinApplication().value(),
                queryParams = queryParamsMetrics,
                requestTime = requestTime,
                responseTime = Os.currentTimeMicros(),
                statusCode = response.statusCode?.value() ?: 500,
                appRouteId = appRouteId,
                targetUrl = targetUrl,
            )

            @OptIn(DelicateCoroutinesApi::class)
            GlobalScope.launch(Dispatchers.Unconfined) {
                monitorMetricsService.addRouteRecord(metricsRecord)
            }

        } catch (e: Throwable) {
            if (log.isWarnEnabled) {
                log.warn("获取监控指标发生例外：${e.message}", e)
            }
        }
    }

}
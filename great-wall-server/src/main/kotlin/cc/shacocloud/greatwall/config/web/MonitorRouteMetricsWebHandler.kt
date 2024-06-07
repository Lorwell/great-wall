package cc.shacocloud.greatwall.config.web

import cc.shacocloud.greatwall.model.po.RouteMetricsRecordPo
import cc.shacocloud.greatwall.service.AppRouteLocator
import cc.shacocloud.greatwall.service.RouteMonitorMetricsService
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import cc.shacocloud.greatwall.utils.getHost
import cc.shacocloud.greatwall.utils.getRealIp
import io.questdb.std.Os
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.reactivestreams.Publisher
import org.springframework.cloud.gateway.route.Route
import org.springframework.core.io.buffer.DataBuffer
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.http.server.reactive.ServerHttpRequestDecorator
import org.springframework.http.server.reactive.ServerHttpResponse
import org.springframework.http.server.reactive.ServerHttpResponseDecorator
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebHandler
import org.springframework.web.server.handler.WebHandlerDecorator
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.util.concurrent.atomic.AtomicLong

/**
 * 监控路由指标 web 处理器
 *
 * @author 思追(shaco)
 */
class MonitorRouteMetricsWebHandler(
    webHandler: WebHandler,
    private val routeMonitorMetricsService: RouteMonitorMetricsService
) : WebHandlerDecorator(webHandler) {

    override fun handle(exchange: ServerWebExchange): Mono<Void> {
        val requestTime = Os.currentTimeMicros()

        // 流量统计委托器
        val requestDecorator = TrafficStatisticsHttpRequestDecorator(exchange.request)
        val responseDecorator = TrafficStatisticsHttpResponseDecorator(exchange.response)

        val newExchange = exchange.mutate()
            .request(requestDecorator)
            .response(responseDecorator)
            .build()

        return delegate.handle(newExchange)
            .doOnSuccess {
                filterCompleteCallback(
                    exchange,
                    requestTime,
                    requestDecorator.requestBodySize,
                    responseDecorator.responseBodySize
                )
            }
            .doOnError {
                filterCompleteCallback(
                    exchange,
                    requestTime,
                    requestDecorator.requestBodySize,
                    responseDecorator.responseBodySize
                )
            }
    }

    /**
     * 过滤器完成回调
     */
    private fun filterCompleteCallback(
        exchange: ServerWebExchange,
        requestTime: Long,
        requestBodySize: AtomicLong,
        responseBodySize: AtomicLong
    ) {
        val response = exchange.response
        val route = exchange.attributes.remove(RouteMetricsGlobalFilter.ROUTE_ATTR) as Route?

        if (response.isCommitted) {
            metricsRecordCommit(exchange, requestTime, route, requestBodySize.get(), responseBodySize.get())
        } else {
            response.beforeCommit {
                metricsRecordCommit(exchange, requestTime, route, requestBodySize.get(), responseBodySize.get())
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
        route: Route?,
        requestBodySize: Long,
        responseBodySize: Long
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
                requestBodySize = requestBodySize,
                responseBodySize = responseBodySize
            )

            @OptIn(DelicateCoroutinesApi::class)
            GlobalScope.launch(Dispatchers.Unconfined) {
                routeMonitorMetricsService.addRouteRecord(metricsRecord)
            }

        } catch (e: Throwable) {
            if (log.isWarnEnabled) {
                log.warn("获取监控指标发生例外：${e.message}", e)
            }
        }
    }

    /**
     * 流量统计请求委托器
     *
     * @author 思追(shaco)
     */
    class TrafficStatisticsHttpRequestDecorator(
        request: ServerHttpRequest
    ) : ServerHttpRequestDecorator(request) {
        val requestBodySize = AtomicLong(0)
        override fun getBody(): Flux<DataBuffer> {
            return super.getBody().map {
                requestBodySize.getAndAdd(it.readableByteCount().toLong())
                it
            }
        }
    }

    /**
     * 流量统计请求委托器
     *
     * @author 思追(shaco)
     */
    class TrafficStatisticsHttpResponseDecorator(
        response: ServerHttpResponse
    ) : ServerHttpResponseDecorator(response) {
        val responseBodySize = AtomicLong(0)

        override fun writeWith(body: Publisher<out DataBuffer>): Mono<Void> {
            return super.writeWith(
                Flux.from(body).map {
                    responseBodySize.getAndAdd(it.readableByteCount().toLong())
                    it
                }
            )
        }

        override fun writeAndFlushWith(body: Publisher<out Publisher<out DataBuffer>>): Mono<Void> {
            return super.writeAndFlushWith(
                Flux.from(body).map {
                    Flux.from(it).map { buf ->
                        responseBodySize.getAndAdd(buf.readableByteCount().toLong())
                        buf
                    }
                }
            )
        }
    }

}
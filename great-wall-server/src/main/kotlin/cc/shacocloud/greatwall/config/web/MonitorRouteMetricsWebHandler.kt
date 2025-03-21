package cc.shacocloud.greatwall.config.web

import cc.shacocloud.greatwall.model.po.RouteMetricsRecordPo
import cc.shacocloud.greatwall.service.AppRouteLocator
import cc.shacocloud.greatwall.service.CompositionMonitorMetricsService
import cc.shacocloud.greatwall.service.CompositionMonitorMetricsService.Companion.monitorMetricsWriteDispatcher
import cc.shacocloud.greatwall.utils.*
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.reactivestreams.Publisher
import org.slf4j.Logger
import org.slf4j.LoggerFactory
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
import java.time.Instant
import java.util.concurrent.atomic.AtomicLong

/**
 * 监控路由指标 web 处理器
 *
 * @author 思追(shaco)
 */
class MonitorRouteMetricsWebHandler(
    webHandler: WebHandler,
    private val monitorMetricsService: CompositionMonitorMetricsService,
) : WebHandlerDecorator(webHandler) {

    companion object {
        private val log: Logger = LoggerFactory.getLogger(MonitorRouteMetricsWebHandler::class.java)
        private val accessLog: Logger = LoggerFactory.getLogger("accessLog")
        private val isAccessLogEnabled = accessLog.isInfoEnabled
    }

    class QueryParamsMetrics : HashMap<String, List<String?>>() {
        override fun toString(): String {
            return entries.flatMap { it.value.map { v -> it.key to v } }
                .joinToString(separator = "&") { (key, value) -> "$key=${value ?: ""}" }
        }
    }

    override fun handle(exchange: ServerWebExchange): Mono<Void> {
        val requestTime = Instant.now()

        // 流量统计委托器
//        val requestDecorator = TrafficStatisticsHttpRequestDecorator(exchange.request)
//        val responseDecorator = TrafficStatisticsHttpResponseDecorator(exchange.response)
//
//        val newExchange = exchange.mutate()
//            .request(requestDecorator)
//            .response(responseDecorator)
//            .build()

        return delegate.handle(exchange)
            .doOnSuccess {
                filterCompleteCallback(
                    exchange,
                    requestTime
                )
            }
            .doOnError {
                filterCompleteCallback(
                    exchange,
                    requestTime
                )
            }
    }

    /**
     * 过滤器完成回调
     */
    private fun filterCompleteCallback(
        exchange: ServerWebExchange,
        requestTime: Instant,
    ) {

        val response = exchange.response

        if (response.isCommitted) {
            metricsRecordCommit(exchange, requestTime)
        } else {
            response.beforeCommit {
                metricsRecordCommit(exchange, requestTime)
                Mono.empty()
            }
        }
    }

    /**
     * 指标记录提交
     */
    private fun metricsRecordCommit(
        exchange: ServerWebExchange,
        requestTime: Instant,
    ) {
        try {
            val responseTime = Instant.now()

            val request = exchange.request
            val response = exchange.response
            val route = exchange.attributes.remove(RouteMetricsGlobalFilter.ROUTE_ATTR) as Route?

            val path = request.path.value()
            val realIp = request.getRealIp()
            val method = request.method.name()
            val statusCode = response.statusCode?.value() ?: 500
            val handleTime = (responseTime - requestTime).toMillis()

            // 路由信息
            val appRouteId = route?.metadata?.get(AppRouteLocator.APP_ROUTE_ID_META_KEY) as Long?
            val targetUrl = route?.uri?.toASCIIString()

            // 查询参数
            val queryParamsMetrics = request.queryParams
                .map { it.key to it.value }.toMap(QueryParamsMetrics())

            // 响应内容长度
            val requestBodySize = request.getContentLength()
            val responseBodySize = response.getContentLength()

            // 打印日志
            if (isAccessLogEnabled) {
                accessLog.info(
                    arrayOf<String>(
                        requestTime.toLocalDateTime().format(DATE_TIME_FORMAT),
                        realIp,
                        request.getHost(),
                        method,
                        "${path}${if (queryParamsMetrics.isEmpty()) "" else "?${queryParamsMetrics}"}",
                        requestBodySize.byteToUnitStr(),
                        "${handleTime}ms",
                        statusCode.toString(),
                        responseBodySize.byteToUnitStr(),
                        targetUrl ?: ""
                    ).joinToString(separator = " - ")
                )
            }

            val metricsRecord = RouteMetricsRecordPo(
                appRouteId = appRouteId,
                ip = realIp,
                method = method,
                endpoint = path,
                requestTime = requestTime,
                responseTime = responseTime,
                handleTime = handleTime,
                statusCode = response.statusCode?.value() ?: 500,
                requestBodySize = requestBodySize,
                responseBodySize = responseBodySize
            )

            Thread.startVirtualThread {
                @OptIn(DelicateCoroutinesApi::class)
                GlobalScope.launch(monitorMetricsWriteDispatcher) {
                    monitorMetricsService.addMetricsRecord(metricsRecord)
                }
            }
        } catch (e: Throwable) {
            if (log.isWarnEnabled) {
                log.warn("获取监控指标发生例外：${e.message}", e)
            }
        }
    }

}

/**
 * 流量统计请求委托器
 *
 * @author 思追(shaco)
 */
class TrafficStatisticsHttpRequestDecorator(
    request: ServerHttpRequest,
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
    response: ServerHttpResponse,
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
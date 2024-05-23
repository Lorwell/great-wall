package cc.shacocloud.greatwall.controller.filter

import cc.shacocloud.greatwall.model.po.CookiesParamsMetrics
import cc.shacocloud.greatwall.model.po.MonitorMetricsRecordPo
import cc.shacocloud.greatwall.model.po.QueryParamsMetrics
import cc.shacocloud.greatwall.service.MonitorMetricsService
import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import cc.shacocloud.greatwall.utils.getHost
import cc.shacocloud.greatwall.utils.getRealIp
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
import org.springframework.cloud.gateway.filter.NettyWriteResponseFilter
import org.springframework.core.Ordered
import org.springframework.http.HttpCookie
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

/**
 * 监控过滤器
 * @author 思追(shaco)
 */
@Slf4j
@Component
class MonitorGlobalFilter(
    val monitorMetricsService: MonitorMetricsService
) : GlobalFilter, Ordered {

    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        val requestTime = System.currentTimeMillis()

        return chain.filter(exchange)
            .doOnSuccess { filterCompleteCallback(exchange, requestTime) }
            .doOnError { filterCompleteCallback(exchange, requestTime) }
    }

    /**
     * 过滤器完成回调
     */
    fun filterCompleteCallback(exchange: ServerWebExchange, requestTime: Long) {
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
    fun metricsRecordCommit(exchange: ServerWebExchange, requestTime: Long) {
        try {
            val request = exchange.request
            val response = exchange.response
            val path = request.path

            val queryParamsMetrics = request.queryParams.map { it.key to it.value }.toMap(QueryParamsMetrics())
            val cookiesParamsMetrics = request.cookies.flatMapTo(CookiesParamsMetrics()) {
                it.value.map { cookie -> HttpCookie(cookie.name, cookie.value) }
            }

            val metricsRecord = MonitorMetricsRecordPo(
                ip = request.getRealIp(),
                host = request.getHost(),
                method = request.method.name(),
                contextPath = path.contextPath().value(),
                appPath = path.pathWithinApplication().value(),
                queryParams = queryParamsMetrics,
                cookies = cookiesParamsMetrics,
                requestTime = requestTime,
                responseTime = System.currentTimeMillis(),
                statusCode = response.statusCode?.value() ?: 500
            )

            @OptIn(DelicateCoroutinesApi::class)
            GlobalScope.launch(Dispatchers.Unconfined) {
                monitorMetricsService.addRecord(metricsRecord)
            }

        } catch (e: Throwable) {
            if (log.isWarnEnabled) {
                log.warn("获取监控指标发生例外：${e.message}", e)
            }
        }
    }

    override fun getOrder(): Int {
        // 尽快启动指标监控，并在我们向客户端写入响应之前报告指标事件
        return NettyWriteResponseFilter.WRITE_RESPONSE_FILTER_ORDER + 1
    }


}
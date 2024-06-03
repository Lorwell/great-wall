package cc.shacocloud.greatwall.controller.handler

import cc.shacocloud.greatwall.model.po.CookiesParamsMetrics
import cc.shacocloud.greatwall.model.po.MonitorMetricsRecordPo
import cc.shacocloud.greatwall.model.po.QueryParamsMetrics
import cc.shacocloud.greatwall.service.MonitorMetricsService
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import cc.shacocloud.greatwall.utils.getHost
import cc.shacocloud.greatwall.utils.getRealIp
import io.questdb.std.Os
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.launch
import org.springframework.http.HttpCookie
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.server.WebHandler
import reactor.core.publisher.Mono

/**
 * @author 思追(shaco)
 */
class MonitorMetricsWebHandler(
    private val webHandler: WebHandler,
    private val monitorMetricsService: MonitorMetricsService
) : WebHandler {

    override fun handle(exchange: ServerWebExchange): Mono<Void> {
        val requestTime = Os.currentTimeMicros()

        return webHandler.handle(exchange)
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
                responseTime = Os.currentTimeMicros(),
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

}
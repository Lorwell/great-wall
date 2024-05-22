package cc.shacocloud.greatwall.controller.filter

import cc.shacocloud.greatwall.model.MonitorMetricsRecordMo
import cc.shacocloud.greatwall.service.MonitorMetricsService
import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import cc.shacocloud.greatwall.utils.getHost
import cc.shacocloud.greatwall.utils.getRealIp
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
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

        try {
            val request = exchange.request
            val path = request.path
            val metricsMo = MonitorMetricsRecordMo(
                ip = request.getRealIp(),
                host = request.getHost(),
                method = request.method.name(),
                contextPath = path.contextPath().value(),
                appPath = path.pathWithinApplication().value(),
                queryParams = request.queryParams.map { it.key to it.value }.toMap(),
                cookies = request.cookies.flatMap { it.value.map { cookie -> HttpCookie(cookie.name, cookie.value) } }
            )
            monitorMetricsService.addRecord(metricsMo)
        } catch (e: Exception) {
            if (log.isWarnEnabled) {
                log.warn("监控指标保存失败！")
            }
        }

        return chain.filter(exchange)
    }

    override fun getOrder(): Int {
        return 0
    }
}
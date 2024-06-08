package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.model.dto.input.RouteMonitorMetricsInput
import cc.shacocloud.greatwall.model.dto.output.ValueMetricsOutput
import cc.shacocloud.greatwall.service.RouteMonitorMetricsService
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 *
 * @author 思追(shaco)
 */
@Validated
@RestController
@RequestMapping("/api/route-monitor-metrics")
class RouteMonitorMetricsController(
    val routeMonitorMetricsService: RouteMonitorMetricsService
) {

    /**
     * 请求统计指标
     */
    @GetMapping("/count/request")
    suspend fun requestCountMetrics(
        @Validated input: RouteMonitorMetricsInput
    ): ValueMetricsOutput {
        return routeMonitorMetricsService.requestCountMetrics(input)
    }

    /**
     * ip统计指标
     */
    @GetMapping("/count/ip")
    suspend fun ipCountMetrics(
        @Validated input: RouteMonitorMetricsInput
    ): ValueMetricsOutput {
        return routeMonitorMetricsService.ipCountMetrics(input)
    }

    /**
     * 请求流量指标
     */
    @GetMapping("/sum/request-traffic")
    suspend fun requestTrafficSumMetrics(
        @Validated input: RouteMonitorMetricsInput
    ): ValueMetricsOutput {
        return routeMonitorMetricsService.requestTrafficSumMetrics(input)
    }


}
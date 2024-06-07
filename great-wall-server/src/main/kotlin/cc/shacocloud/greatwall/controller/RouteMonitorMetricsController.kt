package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.model.dto.input.RouteMonitorMetricsInput
import cc.shacocloud.greatwall.model.dto.output.RouteMonitorMetricsOutput
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
    @GetMapping("/request-count")
    suspend fun requestCountMetrics(
        @Validated input: RouteMonitorMetricsInput
    ): RouteMonitorMetricsOutput {
        return routeMonitorMetricsService.requestCountMetrics(input)
    }


}
package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.controller.interceptor.UserAuth
import cc.shacocloud.greatwall.model.dto.input.RouteCountMetricsInput
import cc.shacocloud.greatwall.model.dto.input.RouteLineMetricsInput
import cc.shacocloud.greatwall.model.dto.input.TopRouteLineMetricsInput
import cc.shacocloud.greatwall.model.dto.output.DurationLineMetricsOutput
import cc.shacocloud.greatwall.model.dto.output.QpsLineMetricsOutput
import cc.shacocloud.greatwall.model.dto.output.TopQpsLineMetricsOutput
import cc.shacocloud.greatwall.model.dto.output.ValueMetricsOutput
import cc.shacocloud.greatwall.service.RouteMonitorMetricsService
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 *
 * @author 思追(shaco)
 */
@UserAuth
@Validated
@RestController
@RequestMapping("/api/route-monitor-metrics")
class RouteMonitorMetricsController(
    val routeMonitorMetricsService: RouteMonitorMetricsService
) {

    /**
     * 请求统计指标
     */
    @PostMapping("/count/request")
    suspend fun requestCountMetrics(
        @RequestBody @Validated input: RouteCountMetricsInput
    ): ValueMetricsOutput {
        return routeMonitorMetricsService.requestCountMetrics(input)
    }

    /**
     * ip统计指标
     */
    @PostMapping("/count/ip")
    suspend fun ipCountMetrics(
        @RequestBody @Validated input: RouteCountMetricsInput
    ): ValueMetricsOutput {
        return routeMonitorMetricsService.ipCountMetrics(input)
    }

    /**
     * 请求流量指标
     */
    @PostMapping("/sum/request-traffic")
    suspend fun requestTrafficSumMetrics(
        @RequestBody @Validated input: RouteCountMetricsInput
    ): ValueMetricsOutput {
        return routeMonitorMetricsService.requestTrafficSumMetrics(input)
    }

    /**
     * 响应流量指标
     */
    @PostMapping("/sum/response-traffic")
    suspend fun responseTrafficSumMetrics(
        @RequestBody @Validated input: RouteCountMetricsInput
    ): ValueMetricsOutput {
        return routeMonitorMetricsService.responseTrafficSumMetrics(input)
    }

    /**
     * 4xx响应状态码指标
     */
    @PostMapping("/count/status-4xx")
    suspend fun status4xxCountMetrics(
        @RequestBody @Validated input: RouteCountMetricsInput
    ): ValueMetricsOutput {
        return routeMonitorMetricsService.status4xxCountMetrics(input)
    }

    /**
     * 5xx响应状态码指标
     */
    @PostMapping("/count/status-5xx")
    suspend fun status5xxCountMetrics(
        @RequestBody @Validated input: RouteCountMetricsInput
    ): ValueMetricsOutput {
        return routeMonitorMetricsService.status5xxCountMetrics(input)
    }


    /**
     * qps 折线图指标
     */
    @PostMapping("/line/qps")
    suspend fun qpsLineMetrics(
        @RequestBody @Validated input: RouteLineMetricsInput
    ): List<QpsLineMetricsOutput> {
        return routeMonitorMetricsService.qpsLineMetrics(input)
    }

    /**
     * duration 折线图指标
     */
    @PostMapping("/line/duration")
    suspend fun durationLineMetrics(
        @RequestBody @Validated input: RouteLineMetricsInput
    ): List<DurationLineMetricsOutput> {
        return routeMonitorMetricsService.durationLineMetrics(input)
    }


    /**
     * top qps 折线图指标
     */
    @PostMapping("/line/top-qps")
    suspend fun topQpsLineMetrics(
        @RequestBody @Validated input: TopRouteLineMetricsInput
    ): List<TopQpsLineMetricsOutput> {
        return routeMonitorMetricsService.topQpsLineMetrics(input)
    }


}
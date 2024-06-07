package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.model.dto.input.RouteMonitorMetricsInput
import cc.shacocloud.greatwall.model.dto.output.RouteMonitorMetricsOutput
import cc.shacocloud.greatwall.model.po.RouteMetricsRecordPo

/**
 * 路由监控指标服务
 * @author 思追(shaco)
 */
interface RouteMonitorMetricsService {

    /**
     * 添加请求指标记录
     */
    suspend fun addRouteRecord(record: RouteMetricsRecordPo)

    /**
     * 请求统计指标
     */
    suspend fun requestCountMetrics(input: RouteMonitorMetricsInput): RouteMonitorMetricsOutput

}
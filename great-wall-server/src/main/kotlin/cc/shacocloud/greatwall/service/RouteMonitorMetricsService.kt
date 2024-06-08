package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.model.dto.input.RouteMonitorMetricsInput
import cc.shacocloud.greatwall.model.dto.output.ValueMetricsOutput
import cc.shacocloud.greatwall.model.po.questdb.RouteMetricsRecordPo

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
    suspend fun requestCountMetrics(input: RouteMonitorMetricsInput): ValueMetricsOutput

    /**
     * ip 统计指标
     */
    suspend fun ipCountMetrics(input: RouteMonitorMetricsInput): ValueMetricsOutput

    /**
     * 请求流量指标
     */
    suspend fun requestTrafficSumMetrics(input: RouteMonitorMetricsInput): ValueMetricsOutput

}
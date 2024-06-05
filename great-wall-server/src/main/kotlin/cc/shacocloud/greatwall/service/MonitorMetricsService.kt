package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.model.po.RouteMetricsRecordPo

/**
 * 监控指标服务
 * @author 思追(shaco)
 */
interface MonitorMetricsService {

    /**
     * 添加请求指标记录
     */
    suspend fun addRouteRecord(record: RouteMetricsRecordPo)

}
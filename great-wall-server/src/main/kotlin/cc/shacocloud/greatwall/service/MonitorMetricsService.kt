package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.model.po.MonitorMetricsRecordPo

/**
 * 监控指标服务
 * @author 思追(shaco)
 */
interface MonitorMetricsService {

    /**
     * 添加监控记录
     */
    suspend fun addRecord(record: MonitorMetricsRecordPo)

}
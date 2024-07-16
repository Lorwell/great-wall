package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.model.dto.input.LineMetricsInput
import cc.shacocloud.greatwall.model.dto.output.MemoryLineMetricsOutput
import cc.shacocloud.greatwall.model.po.SystemMetricsRecordPo

/**
 *
 * @author 思追(shaco)
 */
interface SystemMonitorMetricsService {

    /**
     * 添加系统指标记录
     */
    suspend fun addRouteRecord(record: SystemMetricsRecordPo)

    /**
     * 堆内存直线图指标
     */
    suspend fun headMemoryLineMetrics(input: LineMetricsInput): List<MemoryLineMetricsOutput>
}
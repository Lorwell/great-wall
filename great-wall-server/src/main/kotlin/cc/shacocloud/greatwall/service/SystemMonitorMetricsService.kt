package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.model.dto.input.LineMetricsInput
import cc.shacocloud.greatwall.model.dto.output.*
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
     * 堆内存折线图指标
     */
    suspend fun headMemoryLineMetrics(input: LineMetricsInput): List<MemoryLineMetricsOutput>

    /**
     * 非堆内存折线图指标
     */
    suspend fun nonHeadMemoryLineMetrics(input: LineMetricsInput): List<MemoryLineMetricsOutput>

    /**
     * 直接内存折线图指标
     */
    suspend fun directMemoryLineMetrics(input: LineMetricsInput): List<MemoryLineMetricsOutput>

    /**
     * cpu折线图指标
     */
    suspend fun cpuLineMetrics(input: LineMetricsInput): List<CpuLineMetricsOutput>

    /**
     * 线程折线图指标
     */
    suspend fun threadLineMetrics(input: LineMetricsInput): List<ThreadLineMetricsOutput>

    /**
     * 类加载折线图指标
     */
    suspend fun loadedClassLineMetrics(input: LineMetricsInput): List<LoadedClassLineMetricsOutput>

    /**
     * gc 次数折线图指标
     */
    suspend fun gcCountLineMetrics(input: LineMetricsInput): GcLineMetricsOutput

    /**
     * gc 时间折现图指标
     */
    suspend fun gcTimeLineMetrics(input: LineMetricsInput): GcLineMetricsOutput
}
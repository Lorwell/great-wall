package cc.shacocloud.greatwall.model.po

import cc.shacocloud.greatwall.model.mo.GCInfoMo
import java.time.LocalDateTime

/**
 * 系统指标记录
 *
 * @author 思追(shaco)
 */
data class SystemMetricsRecordPo(

    /**
     * 秒级别时间戳
     */
    val timeUnit: LocalDateTime,

    /**
     * 使用中的堆内存信息
     */
    val usedHeapMemory: Long,

    /**
     * 最大堆内存信息
     */
    val maxHeapMemory: Long,

    /**
     * 使用中的非堆内存信息
     */
    val usedNonHeapMemory: Long,

    /**
     * 最大非堆内存信息
     */
    val maxNonHeapMemory: Long,

    /**
     * 系统cpu负载
     */
    val cpuLoad: Double,

    /**
     * JVM进程 cpu负载
     */
    val processCpuLoad: Double,

    /**
     * 线程统计
     */
    val threadTotal: Int,

    /**
     * 线程状态[Thread.State.NEW]统计
     */
    val threadNewCount: Int,

    /**
     * 线程状态[Thread.State.RUNNABLE]统计
     */
    val threadRunnableCount: Int,

    /**
     * 线程状态[Thread.State.BLOCKED]统计
     */
    val threadBlockedCount: Int,

    /**
     * 线程状态[Thread.State.WAITING]统计
     */
    val threadWaitingCount: Int,

    /**
     * 线程状态[Thread.State.TIMED_WAITING]统计
     */
    val threadTimedWaitingCount: Int,

    /**
     * 线程状态[Thread.State.TERMINATED]统计
     */
    val threadTerminatedCount: Int,

    /**
     * 总加载类计数
     */
    val loadedClassTotal: Long,

    /**
     * 加载的类计数
     */
    val loadedClassCount: Int,

    /**
     * 卸载的类
     */
    val unloadedClasses: Long,

    /**
     * 使用的直接内存
     */
    val directMemoryUse: Long,

    /**
     * 直接内存已提交
     */
    val directMemoryCommitted: Long,

    /**
     * 直接内存最大值
     */
    val directMemoryMax: Long,

    /**
     * gc 信息
     */
    val gcInfos: List<GCInfoMo>


) : BaseMonitorMetricsPo(Type.SYSTEM)



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
    val heapMemoryUse: Long,

    /**
     * 提交的堆内存信息
     */
    val heapMemoryCommitted: Long,

    /**
     * 最大堆内存信息
     */
    val heapMemoryMax: Long? = null,

    /**
     * 使用中的非堆内存信息
     */
    val nonHeapMemoryUse: Long,

    /**
     * 提交的非堆内存信息
     */
    val nonHeapMemoryCommitted: Long,

    /**
     * 最大非堆内存信息
     */
    val nonHeapMemoryMax: Long? = null,

    /**
     * 系统cpu负载
     */
    val cpuLoad: Double? = null,

    /**
     * JVM进程 cpu负载
     */
    val processCpuLoad: Double? = null,

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
    val directMemoryUse: Long? = null,

    /**
     * 直接内存已提交
     */
    val directMemoryCommitted: Long? = null,

    /**
     * 直接内存最大值
     */
    val directMemoryMax: Long? = null,

    /**
     * gc 信息
     */
    val gcInfos: List<GCInfoMo>

) : BaseMonitorMetricsPo(Type.SYSTEM)



package cc.shacocloud.greatwall.service.scheduled

import cc.shacocloud.greatwall.model.mo.GCInfoMo
import cc.shacocloud.greatwall.model.po.SystemMetricsRecordPo
import cc.shacocloud.greatwall.service.CompositionMonitorMetricsService
import cc.shacocloud.greatwall.utils.toLocalDateTime
import com.sun.management.OperatingSystemMXBean
import kotlinx.coroutines.*
import org.springframework.beans.factory.DisposableBean
import org.springframework.stereotype.Service
import java.lang.management.ManagementFactory
import java.lang.management.MemoryType
import java.time.Instant
import java.time.LocalDateTime
import java.util.concurrent.Executors

/**
 * 系统指标调度器
 * @author 思追(shaco)
 */
@Service
class SystemMetricsScheduled(
    private val monitorMetricsService: CompositionMonitorMetricsService,
) : DisposableBean {

    companion object {
        fun <T : Number> T.lessThanZeroLet(defaultValue: T?): T? {
            return when (this) {
                is Int -> if (this >= 0) this else defaultValue
                is Long -> if (this >= 0) this else defaultValue
                is Double -> if (this >= 0) this else defaultValue
                is Float -> if (this >= 0) this else defaultValue
                is Short -> if (this >= 0) this else defaultValue
                is Byte -> if (this >= 0) this else defaultValue
                else -> if (toInt() >= 0) this else defaultValue
            }
        }
    }

    private val dispatcher = Executors.newFixedThreadPool(2).asCoroutineDispatcher()

    init {
        @OptIn(DelicateCoroutinesApi::class)
        GlobalScope.launch {
            launch(dispatcher) {
                try {
                    var timeUnit = Instant.now()
                    delayStartOfSecond(timeUnit)

                    while (true) {
                        timeUnit = Instant.now()

                        launch(dispatcher) {
                            metrics(timeUnit.toLocalDateTime())
                        }

                        delayStartOfSecond(timeUnit)
                    }
                } catch (_: InterruptedException) {
                }
            }
        }
    }

    /**
     * 延迟到秒的开始
     */
    suspend fun delayStartOfSecond(timeUnit: Instant) {
        val milliStr = timeUnit.toEpochMilli().toString()
        val milli = milliStr.substring(milliStr.length - 3).toLong()
        delay((1000 - milli) + 1)
    }

    /**
     * 统计指标
     */
    suspend fun metrics(timeUnit: LocalDateTime) {
        // 堆内存相关
        val memoryMXBean = ManagementFactory.getMemoryMXBean()
        val heapMemoryUsage = memoryMXBean.heapMemoryUsage
        val nonHeapMemoryUsage = memoryMXBean.nonHeapMemoryUsage
        val operatingSystemMXBean = ManagementFactory.getOperatingSystemMXBean()

        // cpu 相关
        val (cpuLoad, processCpuLoad) =
            if (operatingSystemMXBean is OperatingSystemMXBean) {
                val cpuLoad = operatingSystemMXBean.cpuLoad
                val processCpuLoad = operatingSystemMXBean.processCpuLoad
                cpuLoad.lessThanZeroLet(0.0) to processCpuLoad.lessThanZeroLet(0.0)
            } else {
                null to null
            }

        // 线程相关
        val threadMXBean = ManagementFactory.getThreadMXBean()
        val allThread = threadMXBean.getThreadInfo(threadMXBean.allThreadIds).filterNotNull()
        val threadStateMap = allThread.groupBy { it.threadState }

        // 类加载器相关
        val classLoadingMXBean = ManagementFactory.getClassLoadingMXBean()
        val totalLoadedClassCount = classLoadingMXBean.totalLoadedClassCount
        val loadedClassCount = classLoadingMXBean.loadedClassCount
        val unloadedClasses = classLoadingMXBean.unloadedClassCount

        // 直接内存
        val memoryPools = ManagementFactory.getMemoryPoolMXBeans()
        val directMemoryPool = memoryPools.stream()
            .filter { pool -> pool.type == MemoryType.NON_HEAP }
            .findFirst()
            .orElse(null)

        // gc
        val gcInfos = ManagementFactory.getGarbageCollectorMXBeans()
            .map {
                GCInfoMo(name = it.name, count = it.collectionCount, time = it.collectionTime)
            }

        val systemMetricsRecordPo = SystemMetricsRecordPo(
            timeUnit = timeUnit,
            heapMemoryUse = heapMemoryUsage.used,
            heapMemoryCommitted = heapMemoryUsage.committed,
            heapMemoryMax = if (heapMemoryUsage.max < 0) null else heapMemoryUsage.max,
            nonHeapMemoryUse = nonHeapMemoryUsage.used,
            nonHeapMemoryCommitted = nonHeapMemoryUsage.committed,
            nonHeapMemoryMax = if (nonHeapMemoryUsage.max < 0) null else nonHeapMemoryUsage.max,
            cpuLoad = cpuLoad,
            processCpuLoad = processCpuLoad,
            threadTotal = allThread.size,
            threadNewCount = threadStateMap[Thread.State.NEW]?.size ?: 0,
            threadRunnableCount = threadStateMap[Thread.State.RUNNABLE]?.size ?: 0,
            threadBlockedCount = threadStateMap[Thread.State.BLOCKED]?.size ?: 0,
            threadWaitingCount = threadStateMap[Thread.State.WAITING]?.size ?: 0,
            threadTimedWaitingCount = threadStateMap[Thread.State.TIMED_WAITING]?.size ?: 0,
            threadTerminatedCount = threadStateMap[Thread.State.TERMINATED]?.size ?: 0,
            loadedClassTotal = totalLoadedClassCount,
            loadedClassCount = loadedClassCount,
            unloadedClasses = unloadedClasses,
            directMemoryUse = directMemoryPool?.usage?.used,
            directMemoryCommitted = directMemoryPool?.usage?.committed,
            directMemoryMax = directMemoryPool?.usage?.max?.let { if (it < 0) null else it },
            gcInfos = gcInfos,
        )

        monitorMetricsService.addMetricsRecord(systemMetricsRecordPo)
    }

    override fun destroy() {
        dispatcher.close()
    }

}
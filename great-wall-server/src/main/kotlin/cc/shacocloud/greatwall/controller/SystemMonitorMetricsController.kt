package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.controller.interceptor.UserAuth
import cc.shacocloud.greatwall.model.dto.input.LineMetricsInput
import cc.shacocloud.greatwall.model.dto.output.*
import cc.shacocloud.greatwall.service.SystemMonitorMetricsService
import cc.shacocloud.greatwall.utils.DATE_TIME_FORMAT
import cc.shacocloud.greatwall.utils.zoneOffset
import com.sun.management.OperatingSystemMXBean
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*
import java.lang.management.ManagementFactory
import java.lang.management.MemoryType
import java.time.Instant
import java.time.LocalDateTime
import kotlin.jvm.optionals.getOrElse
import kotlin.time.Duration.Companion.seconds

/**
 * 系统监控指标
 * @author 思追(shaco)
 */
@UserAuth
@Validated
@RestController
@RequestMapping("/api/system-monitor-metrics")
class SystemMonitorMetricsController(
    val systemMonitorMetricsService: SystemMonitorMetricsService,
) {

    companion object {
        const val MB = (1024 * 1024).toLong()
        val decimalFormat = java.text.DecimalFormat("0.0")
    }

    /**
     * 系统运行时间指标
     */
    @GetMapping("/up-time")
    suspend fun upTimeMetrics(): UptimeOutput {
        val runtimeMxBean = ManagementFactory.getRuntimeMXBean()
        val uptime = (runtimeMxBean.uptime / 1000).seconds.toString().replace(" ", "")
        val startTime = LocalDateTime.ofInstant(Instant.ofEpochMilli(runtimeMxBean.startTime), zoneOffset)
            .format(DATE_TIME_FORMAT)
        return UptimeOutput(
            startTime = startTime,
            upTime = uptime,
        )
    }

    /**
     * 进程cpu指标
     */
    @GetMapping("/process-cpu")
    suspend fun processCpuMetrics(): ProcessCpuOutput {
        val operatingSystemMXBean = ManagementFactory.getOperatingSystemMXBean()

        if (operatingSystemMXBean is OperatingSystemMXBean) {
            val processCpuLoad = operatingSystemMXBean.processCpuLoad
            return ProcessCpuOutput(
                processCpuLoad = "${decimalFormat.format(processCpuLoad * 100)}%"
            )
        }

        return ProcessCpuOutput(
            processCpuLoad = "-"
        )
    }

    /**
     * 堆内存指标
     */
    @GetMapping("/head-memory")
    suspend fun headMemoryMetrics(): MemoryOutput {
        val memoryMXBean = ManagementFactory.getMemoryMXBean()
        val heapMemoryUsage = memoryMXBean.heapMemoryUsage

        val usedHeapMemory = heapMemoryUsage.used
        return MemoryOutput(
            value = "${decimalFormat.format(usedHeapMemory.toDouble() / MB)}MB"
        )
    }

    /**
     * 非堆内存指标
     */
    @GetMapping("/non-head-memory")
    suspend fun nonHeadMemoryMetrics(): MemoryOutput {
        val memoryMXBean = ManagementFactory.getMemoryMXBean()
        val nonHeapMemoryUsage = memoryMXBean.nonHeapMemoryUsage
        val usedNonHeapMemory = nonHeapMemoryUsage.used
        return MemoryOutput(
            value = "${decimalFormat.format(usedNonHeapMemory.toDouble() / MB)}MB"
        )
    }

    /**
     * 直接内存指标
     */
    @GetMapping("/direct-head-memory")
    suspend fun directMemoryMetrics(): MemoryOutput {
        val memoryPools = ManagementFactory.getMemoryPoolMXBeans()
        return memoryPools.stream()
            .filter { pool -> pool.type == MemoryType.NON_HEAP }
            .findFirst()
            .map {
                val used = it.usage.used.toDouble()
                MemoryOutput(
                    value = "${decimalFormat.format(used / MB)}MB"
                )
            }
            .getOrElse {
                MemoryOutput(value = "-")
            }
    }

    /**
     * 线程总计指标
     */
    @GetMapping("/thread-total")
    suspend fun threadTotalMetrics(): ThreadTotalOutput {
        val threadMXBean = ManagementFactory.getThreadMXBean()
        val total = threadMXBean.threadCount
        return ThreadTotalOutput(value = total)
    }

    /**
     * 堆内存折现图指标
     */
    @PostMapping("/line/head-memory")
    suspend fun headMemoryLineMetrics(
        @RequestBody @Validated input: LineMetricsInput,
    ): List<MemoryLineMetricsOutput> {
        return systemMonitorMetricsService.headMemoryLineMetrics(input)
    }

    /**
     * 非堆内存折现图指标
     */
    @PostMapping("/line/non-head-memory")
    suspend fun nonHeadMemoryLineMetrics(
        @RequestBody @Validated input: LineMetricsInput,
    ): List<MemoryLineMetricsOutput> {
        return systemMonitorMetricsService.nonHeadMemoryLineMetrics(input)
    }

    /**
     * 直接内存折现图指标
     */
    @PostMapping("/line/direct-memory")
    suspend fun directMemoryLineMetrics(
        @RequestBody @Validated input: LineMetricsInput,
    ): List<MemoryLineMetricsOutput> {
        return systemMonitorMetricsService.directMemoryLineMetrics(input)
    }

    /**
     * cpu折现图指标
     */
    @PostMapping("/line/cpu")
    suspend fun cpuLineMetrics(
        @RequestBody @Validated input: LineMetricsInput,
    ): List<CpuLineMetricsOutput> {
        return systemMonitorMetricsService.cpuLineMetrics(input)
    }

    /**
     * 线程折现图指标
     */
    @PostMapping("/line/thread")
    suspend fun threadLineMetrics(
        @RequestBody @Validated input: LineMetricsInput,
    ): List<ThreadLineMetricsOutput> {
        return systemMonitorMetricsService.threadLineMetrics(input)
    }

    /**
     * 类加载折现图指标
     */
    @PostMapping("/line/loaded-class")
    suspend fun loadedClassLineMetrics(
        @RequestBody @Validated input: LineMetricsInput,
    ): List<LoadedClassLineMetricsOutput> {
        return systemMonitorMetricsService.loadedClassLineMetrics(input)
    }

    /**
     * gc 次数折现图指标
     */
    @PostMapping("/line/gc-count")
    suspend fun gcCountLineMetrics(
        @RequestBody @Validated input: LineMetricsInput,
    ): GcLineMetricsOutput {
        return systemMonitorMetricsService.gcCountLineMetrics(input)
    }

    /**
     * gc 时间折现图指标
     */
    @PostMapping("/line/gc-time")
    suspend fun gcTimeLineMetrics(
        @RequestBody @Validated input: LineMetricsInput,
    ): GcLineMetricsOutput {
        return systemMonitorMetricsService.gcTimeLineMetrics(input)
    }


}
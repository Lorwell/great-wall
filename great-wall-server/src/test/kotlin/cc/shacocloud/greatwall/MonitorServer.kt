package cc.shacocloud.greatwall

import com.sun.management.OperatingSystemMXBean
import java.lang.System.*
import java.lang.management.ManagementFactory
import java.lang.management.MemoryType
import java.lang.management.ThreadInfo


class MonitorServer {

    companion object {
        const val GB = (1024 * 1024 * 1024).toLong()
        const val MB = (1024 * 1024).toLong()
        val decimalFormat = java.text.DecimalFormat("0.0")

    }

    fun monitor() {
        val memoryMXBean = ManagementFactory.getMemoryMXBean()
        val heapMemoryUsage = memoryMXBean.heapMemoryUsage
        val nonHeapMemoryUsage = memoryMXBean.nonHeapMemoryUsage

        val usedHeapMemory = heapMemoryUsage.used
        val maxHeapMemory = heapMemoryUsage.max
        val usedNonHeapMemory = nonHeapMemoryUsage.used
        val maxNonHeapMemory = nonHeapMemoryUsage.max

        println("使用中的堆内存：${decimalFormat.format(1.0 * usedHeapMemory / MB)}MB")
        println("使用中的非堆内存：${decimalFormat.format(1.0 * maxHeapMemory / MB)}MB")
        println("使用中的非堆内存：${decimalFormat.format(1.0 * usedNonHeapMemory / MB)}MB")
        val maxNonHeapMemoryInfo = if (maxNonHeapMemory == -1L) {
            "-"
        } else {
            decimalFormat.format(1.0 * maxNonHeapMemory / MB) + "MB"
        }
        println("最大非堆内存：${maxNonHeapMemoryInfo}MB")


        val operatingSystemMXBean = ManagementFactory.getOperatingSystemMXBean()

        if (operatingSystemMXBean is OperatingSystemMXBean) {
            val cpuLoad = operatingSystemMXBean.cpuLoad
            println("系统CPU使用率：${decimalFormat.format(cpuLoad * 100)}%")

            val processCpuLoad = operatingSystemMXBean.processCpuLoad
            println("JVM进程CPU使用率：${decimalFormat.format(processCpuLoad * 100)}%")
        }

        // gc
        val gcMXBeans = ManagementFactory.getGarbageCollectorMXBeans()
        for (gcMXBean in gcMXBeans) {
            val gcName = gcMXBean.name
            val collectionCount = gcMXBean.collectionCount
            val collectionTime = gcMXBean.collectionTime
            println("GC 名称: $gcName")
            println("GC 计数: $collectionCount")
            println("GC 时间: $collectionTime ms")
        }

        // 获取当前活动线程的枚举
        val threadMXBean = ManagementFactory.getThreadMXBean()
        val threadIds: LongArray = threadMXBean.allThreadIds

        // 根据线程ID获取线程信息
        val threadInfos: Array<ThreadInfo> = threadMXBean.getThreadInfo(threadIds)

        for (info in threadInfos) {
            println("Thread 名称: " + info.threadName)
            println("Thread id: " + info.threadId)
            println("Thread 状态: " + info.threadState)
            println("------------------------")
        }


        // 获取ClassLoadingMXBean实例
        val classLoadingMXBean = ManagementFactory.getClassLoadingMXBean()

        // 获取加载的类的数量
        val loadedClassCount = classLoadingMXBean.loadedClassCount.toLong()
        println("加载的类计数：$loadedClassCount")

        // 获取总加载的类的数量
        val totalLoadedClassCount = classLoadingMXBean.totalLoadedClassCount
        println("总加载类计数： $totalLoadedClassCount")

        // 获取卸载的类的数量
        val unloadedClasses = classLoadingMXBean.unloadedClassCount
        println("卸载的类： $unloadedClasses")


        // 获取所有BufferPoolMXBean实例
        val memoryPools = ManagementFactory.getMemoryPoolMXBeans()

        // 查找直接内存缓冲区的MemoryPoolMXBean
        val directMemoryPool = memoryPools.stream()
            .filter { pool -> pool.type == MemoryType.NON_HEAP }
            .findFirst()
            .orElse(null)

        if (directMemoryPool != null) {
            // 获取直接内存缓冲区的使用情况
            val used = directMemoryPool.usage.used
            val committed = directMemoryPool.usage.committed
            val max = directMemoryPool.usage.max

            println("使用的直接内存: ${decimalFormat.format(1.0 * used / MB)}MB");
            println("直接内存已提交: ${decimalFormat.format(1.0 * committed / MB)}MB");
            println("直接内存最大值: ${decimalFormat.format(1.0 * max / MB)}MB");
        } else {
            println("未找到“直接”缓冲池。")
        }

        // 获取RuntimeMXBean实例
        val runtimeMxBean = ManagementFactory.getRuntimeMXBean()

        // 获取JVM已经运行的时间（毫秒）
        val uptime = runtimeMxBean.uptime
        println("JVM 运行时间：$uptime 毫秒")
    }
}

fun main(args: Array<String>) {
    val monitorServer = MonitorServer()
    monitorServer.monitor()
}


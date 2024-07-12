package cc.shacocloud.greatwall

import java.lang.management.ManagementFactory
import java.lang.management.ThreadInfo


class MonitorServer {

    companion object {
        const val GB = (1024 * 1024 * 1024).toLong()
        const val MB = (1024 * 1024).toLong()
        val decimalFormat = java.text.DecimalFormat("0.0")

    }

    fun threadMonitor() {

        // 获取当前活动线程的枚举
        val threadMXBean = ManagementFactory.getThreadMXBean()
        val threadIds: LongArray = threadMXBean.allThreadIds

        // 根据线程ID获取线程信息
        val threadInfos: Array<ThreadInfo> = threadMXBean.getThreadInfo(threadIds)

        for (info in threadInfos) {
            println("Thread Name: " + info.threadName)
            println("Thread ID: " + info.threadId)
            println("Thread State: " + info.threadState)


            // 可以进一步获取堆栈跟踪、锁信息等
            if (info.lockName != null) {
                println("Locked on: " + info.lockName)
            }

            if (info.isInNative) {
                println("Executing in native code")
            }

            println("------------------------")
        }
    }

    fun monitor() {
        val infoModel = MonitorInfoModel()

        val memoryMXBean = ManagementFactory.getMemoryMXBean()
        val heapMemoryUsage = memoryMXBean.heapMemoryUsage
        val nonHeapMemoryUsage = memoryMXBean.nonHeapMemoryUsage

        val usedHeapMemory = heapMemoryUsage.used
        val maxHeapMemory = heapMemoryUsage.max
        val usedNonHeapMemory = nonHeapMemoryUsage.used
        val maxNonHeapMemory = nonHeapMemoryUsage.max

        infoModel.usedHeapMemoryInfo = decimalFormat.format(1.0 * usedHeapMemory / MB) + "MB"
        infoModel.maxHeapMemoryInfo = decimalFormat.format(1.0 * maxHeapMemory / MB) + "MB"
        infoModel.usedNonHeapMemoryInfo = decimalFormat.format(1.0 * usedNonHeapMemory / MB) + "MB"
        infoModel.maxNonHeapMemoryInfo = if (maxNonHeapMemory == -1L) {
            "-"
        } else {
            decimalFormat.format(1.0 * maxNonHeapMemory / MB) + "MB"
        }


        val operatingSystemMXBean = ManagementFactory.getOperatingSystemMXBean()

        infoModel.arch = operatingSystemMXBean.arch
        infoModel.name = operatingSystemMXBean.name
        infoModel.version = operatingSystemMXBean.version

        if (operatingSystemMXBean is com.sun.management.OperatingSystemMXBean) {
            val cpuLoad = operatingSystemMXBean.cpuLoad
            infoModel.cpuLoadInfo = decimalFormat.format(cpuLoad * 100) + "%"

            val processCpuLoad = operatingSystemMXBean.processCpuLoad
            infoModel.processCpuLoadInfo = decimalFormat.format(processCpuLoad * 100) + "%"

            val totalMemorySize = operatingSystemMXBean.totalMemorySize
            val freeMemorySize = operatingSystemMXBean.freeMemorySize

            infoModel.totalMemoryInfo = decimalFormat.format(1.0 * totalMemorySize / GB) + "GB"
            infoModel.freeMemoryInfo = decimalFormat.format(1.0 * freeMemorySize / GB) + "GB"
            infoModel.useMemoryInfo = decimalFormat.format(1.0 * (totalMemorySize - freeMemorySize) / GB) + "GB"
            infoModel.memoryUseRatioInfo =
                decimalFormat.format((1.0 * (totalMemorySize - freeMemorySize) / totalMemorySize * 100)) + "%"

            val freeSwapSpaceSize = operatingSystemMXBean.freeSwapSpaceSize
            val totalSwapSpaceSize = operatingSystemMXBean.totalSwapSpaceSize

            infoModel.freeSwapSpaceInfo = decimalFormat.format(1.0 * freeSwapSpaceSize / GB) + "GB"
            infoModel.totalSwapSpaceInfo = decimalFormat.format(1.0 * totalSwapSpaceSize / GB) + "GB"
            infoModel.useSwapSpaceInfo =
                decimalFormat.format(1.0 * (totalSwapSpaceSize - freeSwapSpaceSize) / GB) + "GB"
            infoModel.swapUseRatioInfo =
                decimalFormat.format((1.0 * (totalSwapSpaceSize - freeSwapSpaceSize) / totalSwapSpaceSize * 100)) + "%"
        }

        println(
            """
                        堆内存使用情况：
                        使用中的堆内存：${infoModel.usedHeapMemoryInfo}
                        最大堆内存：${infoModel.maxHeapMemoryInfo}
                        使用中的非堆内存：${infoModel.usedNonHeapMemoryInfo}
                        最大非堆内存：${infoModel.maxNonHeapMemoryInfo}
                        """.trimIndent()
        )

        println(
            """
                        系统信息：
                        系统架构：${infoModel.arch}
                        系统名称：${infoModel.name}
                        系统版本：${infoModel.version}
                        系统使用情况：
                        CPU使用率：${infoModel.cpuLoadInfo}
                        JVM进程CPU使用率：${infoModel.processCpuLoadInfo}
                        系统总内存：${infoModel.totalMemoryInfo}
                        使用中的内存：${infoModel.useMemoryInfo}
                        内存使用率：${infoModel.memoryUseRatioInfo}
                        系统总交换内存：${infoModel.totalSwapSpaceInfo}
                        使用中的交换内存：${infoModel.useSwapSpaceInfo}
                        交换内存使用率：${infoModel.swapUseRatioInfo}
                        
                        """.trimIndent()
        )
    }
}

fun main(args: Array<String>) {
    val monitorServer = MonitorServer()
    monitorServer.monitor()
    monitorServer.threadMonitor()
}


data class MonitorInfoModel(

    /**
     * 使用中的堆内存信息
     */
    var usedHeapMemoryInfo: String? = null,

    /**
     * 最大堆内存信息
     */
    var maxHeapMemoryInfo: String? = null,

    /**
     * 使用中的非堆内存信息
     */
    var usedNonHeapMemoryInfo: String? = null,

    /**
     * 最大非堆内存信息
     */
    var maxNonHeapMemoryInfo: String? = null,

    /**
     * 系统cpu使用率信息
     */
    var cpuLoadInfo: String? = null,

    /**
     * JVM进程 cpu使用率信息
     */
    var processCpuLoadInfo: String? = null,

    /**
     * 系统总内存信息
     */
    var totalMemoryInfo: String? = null,

    /**
     * 系统空闲内存信息
     */
    var freeMemoryInfo: String? = null,

    /**
     * 使用中的内存信息
     */
    var useMemoryInfo: String? = null,

    /**
     * 内存使用率
     */
    var memoryUseRatioInfo: String? = null,

    /**
     * 空闲交换内存信息
     */
    var freeSwapSpaceInfo: String? = null,

    /**
     * 总交换内存信息
     */
    var totalSwapSpaceInfo: String? = null,

    /**
     * 使用中交换内存信息
     */
    var useSwapSpaceInfo: String? = null,

    /**
     * 交换内存使用率信息
     */
    var swapUseRatioInfo: String? = null,

    /**
     * 系统架构
     */
    var arch: String? = null,

    /**
     * 系统名称
     */
    var name: String? = null,

    /**
     * 版本
     */
    var version: String? = null
)


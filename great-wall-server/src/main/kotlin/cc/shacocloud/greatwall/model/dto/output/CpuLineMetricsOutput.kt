package cc.shacocloud.greatwall.model.dto.output

/**
 * cpu折线图指标结果
 * @author 思追(shaco)
 */
data class CpuLineMetricsOutput(

    /**
     * 单元
     */
    override val unit: String,

    /**
     * 系统cpu负载
     */
    val cpuLoad: Double? = null,

    /**
     * JVM进程 cpu负载
     */
    val processCpuLoad: Double? = null,

    ) : LineMetricsOutput(unit)

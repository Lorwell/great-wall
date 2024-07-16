package cc.shacocloud.greatwall.model.dto.output

/**
 * 内存折线图指标结果
 * @author 思追(shaco)
 */
data class MemoryLineMetricsOutput(

    /**
     * 单元
     */
    override val unit: String,

    /**
     * 值
     */
    val value: Long,

    ) : LineMetricsOutput(unit)

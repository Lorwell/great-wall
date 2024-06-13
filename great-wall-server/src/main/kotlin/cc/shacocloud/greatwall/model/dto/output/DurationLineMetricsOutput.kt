package cc.shacocloud.greatwall.model.dto.output

/**
 *  Duration 折线图指标结果
 * @author 思追(shaco)
 */
data class DurationLineMetricsOutput(

    /**
     * 单元
     */
    override val unit: String,

    /**
     * 平均值
     */
    val avgValue: Long,

    /**
     * 最大值
     */
    val maxValue: Long

) : LineMetricsOutput(unit)

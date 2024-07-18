package cc.shacocloud.greatwall.model.mo

import cc.shacocloud.greatwall.model.dto.output.LineMetricsOutput

/**
 * top qps折线图指标结果
 * @author 思追(shaco)
 */
data class GcLineMetricsMo(

    /**
     * 单元
     */
    override val unit: String,

    /**
     * 类型表的id
     */
    val typeId: Int,

    /**
     * 值
     */
    val value: Long

) : LineMetricsOutput(unit)

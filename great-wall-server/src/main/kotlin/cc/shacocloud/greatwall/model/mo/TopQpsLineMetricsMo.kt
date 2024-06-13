package cc.shacocloud.greatwall.model.mo

import cc.shacocloud.greatwall.model.dto.output.LineMetricsOutput

/**
 * top qps折线图指标结果
 * @author 思追(shaco)
 */
data class TopQpsLineMetricsMo(

    /**
     * 单元
     */
    override val unit: String,

    /**
     * api 请求地址
     */
    val api: String,

    /**
     * 值
     */
    val value: Long

) : LineMetricsOutput(unit)

package cc.shacocloud.greatwall.model.dto.output

/**
 *  流量 折线图指标结果
 * @author 思追(shaco)
 */
data class TrafficMetricsOutput(

    /**
     * 单元
     */
    override val unit: String,

    /**
     * 请求
     */
    val request: Long,

    /**
     * 响应
     */
    val response: Long,
) : LineMetricsOutput(unit)

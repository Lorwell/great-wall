package cc.shacocloud.greatwall.model.dto.output

/**
 *
 * @author 思追(shaco)
 */
data class TopQpsLineMetricsOutput(

    val api: String,

    val data: List<QpsLineMetricsOutput>
)

package cc.shacocloud.greatwall.model.dto.output

/**
 * gc 统计折线图指标结果
 * @author 思追(shaco)
 */
data class GcLineMetricsOutput(

    val mapping: List<GcMappingOutput>,

    val data: List<Map<String, Any?>>,
)

data class GcMappingOutput(
    val label: String,
    val key: String,
)
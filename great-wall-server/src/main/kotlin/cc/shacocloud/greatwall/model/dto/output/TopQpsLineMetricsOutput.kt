package cc.shacocloud.greatwall.model.dto.output

/**
 *
 * @author 思追(shaco)
 */
data class TopQpsLineMetricsOutput(

    val mapping: List<TopQpsApiKeyMappingOutput>,

    val data: List<Map<String, Any>>
)

data class TopQpsApiKeyMappingOutput(
    val label: String,
    val key: String
)
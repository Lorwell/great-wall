package cc.shacocloud.greatwall.model.dto.input

import jakarta.validation.constraints.NotEmpty

/**
 * @author 思追(shaco)
 */
data class BatchDeleteInput(
    @NotEmpty
    val ids: List<Long>
)
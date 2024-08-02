package cc.shacocloud.greatwall.model.mo

import jakarta.validation.constraints.NotEmpty

/**
 *
 * @author 思追(shaco)
 */
data class ValueMo(

    /**
     * 值
     */
    @field:NotEmpty
    val value: String,
)

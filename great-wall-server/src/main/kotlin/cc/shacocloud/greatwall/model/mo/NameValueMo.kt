package cc.shacocloud.greatwall.model.mo

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty

/**
 *
 * @author 思追(shaco)
 */
data class NameValueMo(

    /**
     * 名称
     */
    @field:NotBlank
    val name: String,

    /**
     * 值
     */
    @field:NotEmpty
    val value: String,
)

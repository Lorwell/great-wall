package cc.shacocloud.greatwall.model.dto.input

import jakarta.validation.constraints.NotBlank
import org.hibernate.validator.constraints.Length

/**
 * @author 思追(shaco)
 */
data class StaticResourcesInput(

    /**
     * 名称
     */
    @field:NotBlank
    @field:Length(max = 50)
    val name: String,

    /**
     * 描述
     */
    @field:Length(max = 150)
    val describe: String? = null
)
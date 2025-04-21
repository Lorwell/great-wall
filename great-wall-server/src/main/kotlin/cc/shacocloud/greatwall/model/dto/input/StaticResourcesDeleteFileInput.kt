package cc.shacocloud.greatwall.model.dto.input

import jakarta.validation.constraints.NotBlank

/**
 * @author 思追(shaco)
 */
data class StaticResourcesDeleteFileInput(

    @field:NotBlank
    val relativePath: String
)
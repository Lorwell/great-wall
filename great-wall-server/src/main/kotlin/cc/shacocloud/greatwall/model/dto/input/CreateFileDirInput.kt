package cc.shacocloud.greatwall.model.dto.input

import jakarta.validation.constraints.NotBlank

/**
 * @author 思追(shaco)
 */
data class CreateFileDirInput(

    /**
     * 父目录
     */
    val parentDir: String?,

    @field:NotBlank
    val name: String
)

package cc.shacocloud.greatwall.model.dto.input

import jakarta.validation.constraints.NotBlank
import org.hibernate.validator.constraints.Length

/**
 * @author 思追(shaco)
 */
data class LoginInput(

    /**
     * 账号
     */
    @field:NotBlank
    @field:Length(max = 20)
    val username: String,

    /**
     * 密码
     */
    @field:NotBlank
    @field:Length(max = 50)
    val password: String

)

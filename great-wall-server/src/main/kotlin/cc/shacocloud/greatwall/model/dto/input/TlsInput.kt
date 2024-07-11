package cc.shacocloud.greatwall.model.dto.input

import cc.shacocloud.greatwall.model.mo.TlsConfig
import jakarta.validation.Valid
import jakarta.validation.constraints.NotNull

/**
 *
 * @author 思追(shaco)
 */
data class TlsInput(


    /**
     * 证书配置
     */
    @field:Valid
    @field:NotNull
    val config: TlsConfig

)

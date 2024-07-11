package cc.shacocloud.greatwall.model.mo

import jakarta.validation.Valid
import jakarta.validation.constraints.NotEmpty
import java.time.Duration

/**
 * 路由地址配置
 * @author 思追(shaco)
 */
data class RouteTargetConfig(

    /**
     * 连接超时以毫为单位，默认为 30s
     */
    val connectTimeout: Duration = Duration.ofSeconds(30),

    /**
     * 响应超时，默认不超时
     */
    val responseTimeout: Duration? = null,

    /**
     * 目标地址
     */
    @field:Valid
    @field:NotEmpty
    val urls: ArrayList<RouteUrl>

)
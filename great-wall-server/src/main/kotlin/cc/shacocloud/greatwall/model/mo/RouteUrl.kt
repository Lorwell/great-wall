package cc.shacocloud.greatwall.model.mo

import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank

class RouteUrls : ArrayList<RouteUrl>()

/**
 * 路由肚子
 * @author 思追(shaco)
 */
data class RouteUrl(

    /**
     * 请求地址
     */
    @field:NotBlank
    val url: String,

    /**
     * 权重
     */
    @field:Min(1)
    val weight: Int

)
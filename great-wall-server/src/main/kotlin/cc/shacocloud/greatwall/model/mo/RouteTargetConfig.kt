package cc.shacocloud.greatwall.model.mo

import cc.shacocloud.greatwall.model.constant.RouteTargetEnum
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.validation.Valid
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import java.time.Duration

/**
 * 路由地址配置
 * @author 思追(shaco)
 */

/**
 * 路由条件
 */
@JsonTypeInfo(
    use = JsonTypeInfo.Id.NAME,
    include = JsonTypeInfo.As.EXISTING_PROPERTY,
    property = "type",
    defaultImpl = RouteUrlsTargetConfig::class
)
@JsonSubTypes(
    JsonSubTypes.Type(value = RouteUrlsTargetConfig::class, name = "Urls"),
    JsonSubTypes.Type(value = RouteStaticResourcesTargetConfig::class, name = "StaticResources"),
)
abstract class RouteTargetConfig(
    /**
     * 条件类型
     */
    @field:NotNull
    val type: RouteTargetEnum

)

data class RouteStaticResourcesTargetConfig(

    /**
     * 静态资源id
     */
    @field:Min(0)
    val id: Long,

    /**
     * 默认的主页
     */
    val index: String,

    /**
     * 404 重定向
     *
     * 如果为 null 则表示不开启
     */
    val tryfile404: String? = null

) : RouteTargetConfig(type = RouteTargetEnum.StaticResources)


data class RouteUrlsTargetConfig(

    /**
     * 连接超时以毫为单位，默认为 3s
     */
    val connectTimeout: Duration = Duration.ofSeconds(3),

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

) : RouteTargetConfig(type = RouteTargetEnum.Urls)
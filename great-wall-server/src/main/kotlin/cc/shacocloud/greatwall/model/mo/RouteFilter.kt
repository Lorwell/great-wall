package cc.shacocloud.greatwall.model.mo

import cc.shacocloud.greatwall.model.constant.RouteFilterEnum
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

/**
 * 路由过滤器
 * @author 思追(shaco)
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = RouteBasicAuthFilter::class, name = "BasicAuth"),
)
abstract class RouteFilter(

    @field:NotNull
    val type: RouteFilterEnum,

    )

data class RouteBasicAuthFilter(

    /**
     * 账号
     */
    @field:NotBlank
    val username: String,

    /**
     * 密码
     */
    @field:NotBlank
    val password: String,

    ) : RouteFilter(RouteFilterEnum.BasicAuth)
package cc.shacocloud.greatwall.model.mo

import cc.shacocloud.greatwall.config.web.filter.BasicAuthGatewayFilterFactory
import cc.shacocloud.greatwall.model.constant.RouteFilterEnum
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull

/**
 * 路由过滤器集合
 * @author 思追(shaco)
 */
class RouteFilters : ArrayList<RouteFilter>()

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

    ) {

    /**
     * 填充配置
     */
    abstract fun <T : Any> fillConfig(config: T)
}

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

    ) : RouteFilter(RouteFilterEnum.BasicAuth) {

    override fun <T : Any> fillConfig(config: T) {
        config as BasicAuthGatewayFilterFactory.Config
        config.username = username
        config.password = password
    }
}
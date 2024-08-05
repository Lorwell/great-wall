package cc.shacocloud.greatwall.model.mo

import cc.shacocloud.greatwall.config.web.filter.*
import cc.shacocloud.greatwall.model.constant.RouteFilterEnum
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.validation.Valid
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import org.springframework.http.HttpStatusCode

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
    JsonSubTypes.Type(value = RouteAddRequestHeadersFilter::class, name = "AddRequestHeaders"),
    JsonSubTypes.Type(value = RouteAddRequestQueryParametersFilter::class, name = "AddRequestQueryParameters"),
    JsonSubTypes.Type(value = RouteAddResponseHeadersFilter::class, name = "AddResponseHeaders"),
    JsonSubTypes.Type(value = RouteRemoveRequestHeadersFilter::class, name = "RemoveRequestHeaders"),
    JsonSubTypes.Type(value = RouteRemoveRequestQueryParametersFilter::class, name = "RemoveRequestQueryParameters"),
    JsonSubTypes.Type(value = RouteRemoveResponseHeadersFilter::class, name = "RemoveResponseHeaders"),
    JsonSubTypes.Type(value = RouteTokenBucketRequestRateLimiterFilter::class, name = "TokenBucketRequestRateLimiter"),
    JsonSubTypes.Type(value = RoutePreserveHostHeaderFilter::class, name = "PreserveHostHeader"),
)
abstract class RouteFilter(

    @field:NotNull val type: RouteFilterEnum,

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
    @field:NotBlank val username: String,

    /**
     * 密码
     */
    @field:NotBlank val password: String,

    ) : RouteFilter(RouteFilterEnum.BasicAuth) {

    override fun <T : Any> fillConfig(config: T) {
        config as BasicAuthGatewayFilterFactory.Config
        config.username = username
        config.password = password
    }
}

data class RouteAddRequestHeadersFilter(

    @field:Valid
    val headers: List<NameValueMo> = listOf(),

    ) : RouteFilter(RouteFilterEnum.AddRequestHeaders) {

    override fun <T : Any> fillConfig(config: T) {
        config as AddRequestHeadersGatewayFilterFactory.Config
        config.headers = headers
    }
}

data class RouteAddRequestQueryParametersFilter(

    @field:Valid
    val params: List<NameValueMo> = listOf(),

    ) : RouteFilter(RouteFilterEnum.AddRequestQueryParameters) {

    override fun <T : Any> fillConfig(config: T) {
        config as AddRequestQueryParametersGatewayFilterFactory.Config
        config.params = params
    }
}

data class RouteAddResponseHeadersFilter(

    @field:Valid
    val headers: List<NameValueMo> = listOf(),

    ) : RouteFilter(RouteFilterEnum.AddResponseHeaders) {

    override fun <T : Any> fillConfig(config: T) {
        config as AddResponseHeadersGatewayFilterFactory.Config
        config.headers = headers
    }
}

data class RouteRemoveRequestHeadersFilter(

    val headerNames: List<ValueMo> = listOf(),

    ) : RouteFilter(RouteFilterEnum.RemoveRequestHeaders) {

    override fun <T : Any> fillConfig(config: T) {
        config as RemoveRequestHeadersGatewayFilterFactory.Config
        config.headerNames = headerNames.map { it.value }
    }
}

data class RouteRemoveRequestQueryParametersFilter(

    val paramNames: List<ValueMo> = listOf(),

    ) : RouteFilter(RouteFilterEnum.RemoveRequestQueryParameters) {

    override fun <T : Any> fillConfig(config: T) {
        config as RemoveRequestQueryParametersGatewayFilterFactory.Config
        config.paramNames = paramNames.map { it.value }
    }
}

data class RouteRemoveResponseHeadersFilter(

    val headerNames: List<ValueMo> = listOf(),

    ) : RouteFilter(RouteFilterEnum.RemoveResponseHeaders) {

    override fun <T : Any> fillConfig(config: T) {
        config as RemoveResponseHeadersGatewayFilterFactory.Config
        config.headerNames = headerNames.map { it.value }
    }
}

data class RouteTokenBucketRequestRateLimiterFilter(

    /**
     * 触发限流时响应的状态码
     */
    @field:Min(100)
    @field:Max(999)
    val statusCode: Int,

    /**
     * 令牌数量限制
     */
    @field:Min(1)
    val limit: Int,

    ) : RouteFilter(RouteFilterEnum.TokenBucketRequestRateLimiter) {

    override fun <T : Any> fillConfig(config: T) {
        config as TokenBucketRequestRateLimiterGatewayFilterFactory.Config
        config.statusCode = HttpStatusCode.valueOf(statusCode)
        config.limit = limit
    }
}

data class RoutePreserveHostHeaderFilter(

    /**
     * 是否保留，false 不保留，反之保留
     */
    val preserve: Boolean,

    ) : RouteFilter(RouteFilterEnum.PreserveHostHeader) {

    override fun <T : Any> fillConfig(config: T) {
        config as PreserveHostHeaderGatewayFilterFactory.Config
        config.preserve = preserve
    }
}
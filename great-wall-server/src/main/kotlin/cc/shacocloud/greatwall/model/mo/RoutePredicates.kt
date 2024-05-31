package cc.shacocloud.greatwall.model.mo

import cc.shacocloud.greatwall.model.constant.RoutePredicateEnum
import cc.shacocloud.greatwall.model.constant.RoutePredicateOperatorEnum
import cc.shacocloud.greatwall.utils.validator.Regexp
import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import org.springframework.cloud.gateway.handler.predicate.*
import org.springframework.http.HttpMethod


/**
 * 路由条件
 * @author 思追(shaco)
 */
class RoutePredicates : ArrayList<RoutePredicateOperator>()

/**
 * 路由条件操作符
 */
data class RoutePredicateOperator(
    val operator: RoutePredicateOperatorEnum,
    val predicate: RoutePredicate
)

/**
 * 路由条件
 */
@JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXTERNAL_PROPERTY, property = "type")
@JsonSubTypes(
    JsonSubTypes.Type(value = RouteCookiePredicate::class, name = "Cookie"),
    JsonSubTypes.Type(value = RouteHeaderPredicate::class, name = "Header"),
    JsonSubTypes.Type(value = RouteHostPredicate::class, name = "Host"),
    JsonSubTypes.Type(value = RouteMethodPredicate::class, name = "Method"),
    JsonSubTypes.Type(value = RoutePathPredicate::class, name = "Path"),
    JsonSubTypes.Type(value = RouteQueryPredicate::class, name = "Query"),
    JsonSubTypes.Type(value = RouteRemoteAddrPredicate::class, name = "RemoteAddr"),
)
abstract class RoutePredicate(

    /**
     * 条件类型
     */
    @field:NotNull
    val type: RoutePredicateEnum

) {

    /**
     * 填充配置
     */
    abstract fun <T : Any> fillConfig(config: T, baseInfo: BaseRouteInfo)

}

data class RouteCookiePredicate(

    /**
     * cookie 名称
     */
    @field:NotBlank
    val name: String,

    /**
     * cookie 值的正则表达式
     */
    @field:NotBlank
    @field:Regexp
    val regexp: String

) : RoutePredicate(RoutePredicateEnum.Cookie) {

    /**
     * 填充配置
     */
    override fun <T : Any> fillConfig(config: T, baseInfo: BaseRouteInfo) {
        config as CookieRoutePredicateFactory.Config
        config.setName(name)
        config.setRegexp(regexp)
    }
}

data class RouteHeaderPredicate(

    /**
     * 请求头 名称
     */
    @field:NotBlank
    val header: String,

    /**
     * 请求头 值的正则表达式
     */
    @field:Regexp
    val regexp: String

) : RoutePredicate(RoutePredicateEnum.Header) {

    /**
     * 填充配置
     */
    override fun <T : Any> fillConfig(config: T, baseInfo: BaseRouteInfo) {
        config as HeaderRoutePredicateFactory.Config
        config.setHeader(header)
        config.setRegexp(regexp)
    }
}

data class RouteQueryPredicate(

    /**
     * 请求头 名称
     */
    @field:NotBlank
    val param: String,

    /**
     * 请求头 值的正则表达式
     */
    @field:Regexp
    val regexp: String

) : RoutePredicate(RoutePredicateEnum.Query) {

    /**
     * 填充配置
     */
    override fun <T : Any> fillConfig(config: T, baseInfo: BaseRouteInfo) {
        config as QueryRoutePredicateFactory.Config
        config.setParam(param)
        config.setRegexp(regexp)
    }
}

data class RouteHostPredicate(

    /**
     * Ant风格的模式 Host 请求头的值
     */
    @field:NotEmpty
    val patterns: List<String>

) : RoutePredicate(RoutePredicateEnum.Host) {

    /**
     * 填充配置
     */
    override fun <T : Any> fillConfig(config: T, baseInfo: BaseRouteInfo) {
        config as HostRoutePredicateFactory.Config
        config.setPatterns(patterns)
    }
}

data class RouteMethodPredicate(

    /**
     * 请求方式
     */
    @field:NotEmpty
    val methods: List<String>

) : RoutePredicate(RoutePredicateEnum.Method) {

    /**
     * 填充配置
     */
    override fun <T : Any> fillConfig(config: T, baseInfo: BaseRouteInfo) {
        config as MethodRoutePredicateFactory.Config
        config.setMethods(*methods.map { HttpMethod.valueOf(it.uppercase()) }.toTypedArray())
    }
}

data class RoutePathPredicate(

    /**
     * 路径匹配规则，该pattern是Ant风格的模式
     */
    @field:NotEmpty
    val patterns: List<String>,

    /**
     * 是否匹配尾部斜杠，默认为 true
     */
    @field:NotNull
    val matchTrailingSlash: Boolean = true

) : RoutePredicate(RoutePredicateEnum.Path) {

    /**
     * 填充配置
     */
    override fun <T : Any> fillConfig(config: T, baseInfo: BaseRouteInfo) {
        config as PathRoutePredicateFactory.Config
        config.setPatterns(patterns)
        config.setMatchTrailingSlash(matchTrailingSlash)
    }
}

data class RouteRemoteAddrPredicate(

    /**
     * CIDR注解（IPv4或IPv6）字符串，
     * 如 192.168.0.1/16（其中 192.168.0.1 是一个IP地址，16 是一个子网掩码
     */
    @field:NotEmpty
    val sources: List<String>


) : RoutePredicate(RoutePredicateEnum.RemoteAddr) {

    /**
     * 填充配置
     */
    override fun <T : Any> fillConfig(config: T, baseInfo: BaseRouteInfo) {
        config as RemoteAddrRoutePredicateFactory.Config
        config.setSources(sources)
    }
}





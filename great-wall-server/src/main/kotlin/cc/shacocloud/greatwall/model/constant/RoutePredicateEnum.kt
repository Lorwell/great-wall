package cc.shacocloud.greatwall.model.constant

import org.springframework.cloud.gateway.handler.predicate.*
import org.springframework.core.ResolvableType


/**
 * 路由条件枚举
 * @see [https://springdoc.cn/spring-cloud-gateway/#gateway-request-predicates-factories]
 * @author 思追(shaco)
 */
enum class RoutePredicateEnum(
    val factoryClass: Class<out RoutePredicateFactory<out Any>>
) {

    /**
     * Cookie 路由谓词工厂接受两个参数，即 cookie name 和一个 regexp（这是一个Java正则表达式）。
     * 这个谓词匹配具有给定名称且其值符合正则表达式的cookie
     */
    Cookie(CookieRoutePredicateFactory::class.java),

    /**
     * Header 路由谓词工厂需要两个参数，header 和一个 regexp（这是一个Java正则表达式）。
     * 这个谓词与具有给定名称且其值与正则表达式相匹配的 header 匹配
     */
    Header(HeaderRoutePredicateFactory::class.java),

    /**
     * Host 路由谓语工厂接受一个参数：一个主机（Host）名称的 patterns 列表。该pattern是Ant风格的模式，以 . 为分隔符。
     * 这个谓词匹配符合该pattern的Host header
     */
    Host(HostRoutePredicateFactory::class.java),

    /**
     * Method 路由谓词工厂接受一个 methods 参数，它是一个或多个参数：要匹配的HTTP方法
     */
    Method(MethodRoutePredicateFactory::class.java),

    /**
     * Path 路由谓词工厂需要两个参数：一个Spring PathMatcher patterns 的list和一个可选的flag matchTrailingSlash（默认为 true）
     *
     * 该pattern是Ant风格的模式
     */
    Path(PathRoutePredicateFactory::class.java),

    /**
     * Query 路由谓词工厂需要两个参数：一个必需的 param 和一个可选的 regexp（这是一个Java正则表达式）
     */
    Query(QueryRoutePredicateFactory::class.java),

    /**
     * RemoteAddr 路由谓词工厂接受一个 sources 集合（最小长度为1），它是CIDR注解（IPv4或IPv6）字符串，
     * 如 192.168.0.1/16（其中 192.168.0.1 是一个IP地址，16 是一个子网掩码
     */
    RemoteAddr(RemoteAddrRoutePredicateFactory::class.java),

    /**
     * Weight 路由谓语工厂需要两个参数：group 和 weight（一个int值）。weight 是按 group 计算的
     */
    Weight(WeightRoutePredicateFactory::class.java), ;

    /**
     * 获取路由条件工厂参数类型
     */
    fun getParamsClass(): Class<out Any> {
        val type = ResolvableType.forClass(factoryClass, RoutePredicateFactory::class.java)
        return type.generics[0].toClass()
    }

}
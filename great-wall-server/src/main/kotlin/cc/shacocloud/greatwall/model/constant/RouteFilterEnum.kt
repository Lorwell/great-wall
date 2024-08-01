package cc.shacocloud.greatwall.model.constant

import cc.shacocloud.greatwall.config.web.filter.*
import org.springframework.cloud.gateway.filter.factory.GatewayFilterFactory

/**
 * 路由过滤器
 *
 * @author 思追(shaco)
 */
enum class RouteFilterEnum(
    val factoryClass: Class<out GatewayFilterFactory<out Any>>,
) {

    /* ------------------------  身份认证 ------------------------------- */

    /**
     * RFC 7235 HTTP 身份验证，服务器可以用来质询（challenge）客户端的请求，客户端则可以提供身份验证凭据。
     */
    BasicAuth(BasicAuthGatewayFilterFactory::class.java),


    /* ------------------------  安全防护 ------------------------------- */


    /* ------------------------  流量控制 ------------------------------- */

    /**
     * 令牌桶算法流量空值
     */
    TokenBucketRequestRateLimiter(TokenBucketRequestRateLimiterGatewayFilterFactory::class.java),


    /* ------------------------  请求修改 ------------------------------- */

    /**
     * 添加请求标头
     */
    AddRequestHeaders(AddRequestHeadersGatewayFilterFactory::class.java),

    /**
     * 添加查询参数
     */
    AddRequestQueryParameters(AddRequestQueryParametersGatewayFilterFactory::class.java),

    /**
     * 添加响应标头
     */
    AddResponseHeaders(AddResponseHeadersGatewayFilterFactory::class.java),

    /**
     * 删除请求标头
     */
    RemoveRequestHeaders(RemoveRequestHeadersGatewayFilterFactory::class.java),

    /**
     * 删除查询参数
     */
    RemoveRequestQueryParameters(RemoveRequestQueryParametersGatewayFilterFactory::class.java),

    /**
     * 删除响应标头
     */
    RemoveResponseHeaders(RemoveResponseHeadersGatewayFilterFactory::class.java),
}
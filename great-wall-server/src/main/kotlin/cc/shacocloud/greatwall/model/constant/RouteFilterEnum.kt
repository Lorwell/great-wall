package cc.shacocloud.greatwall.model.constant

import cc.shacocloud.greatwall.config.web.filter.BasicAuthGatewayFilterFactory
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

}
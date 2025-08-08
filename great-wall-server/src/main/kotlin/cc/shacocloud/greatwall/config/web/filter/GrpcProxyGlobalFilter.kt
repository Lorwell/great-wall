package cc.shacocloud.greatwall.config.web.filter

import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.beans.factory.ObjectProvider
import org.springframework.cloud.gateway.config.HttpClientProperties
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.NettyRoutingFilter
import org.springframework.cloud.gateway.filter.headers.HttpHeadersFilter
import org.springframework.core.Ordered
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpMethod
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono
import reactor.netty.http.HttpProtocol
import reactor.netty.http.client.HttpClient

/**
 * gRPC 代理全局过滤器
 *
 * 解决 Spring Cloud Gateway 代理明文 HTTP/2 gRPC 请求时的协议转换问题
 * 确保 gRPC 请求使用正确的 content-type 和 HTTP/2 协议
 *
 * @author 思追(shaco)
 */
@Component
class GrpcProxyGlobalFilter(
    httpClient: HttpClient,
    headersFiltersProvider: ObjectProvider<List<HttpHeadersFilter>>,
    properties: HttpClientProperties
) : NettyRoutingFilter(
    httpClient.protocol(HttpProtocol.H2C, HttpProtocol.H2),
    headersFiltersProvider,
    properties
), Ordered {

    companion object {
        private val log: Logger = LoggerFactory.getLogger(GrpcProxyGlobalFilter::class.java)
        private const val GRPC_CONTENT_TYPE = "application/grpc"
        private const val GRPC_CONTENT_TYPE_PREFIX = "application/grpc+"
    }

    /**
     * 判断是否为 gRPC 请求
     */
    private fun isGrpcRequest(request: ServerHttpRequest): Boolean {
        val contentType = request.headers.getFirst(HttpHeaders.CONTENT_TYPE)

        // 检查 content-type 是否为 gRPC
        val hasGrpcContentType = contentType != null &&
            (contentType.startsWith(GRPC_CONTENT_TYPE_PREFIX) || contentType == GRPC_CONTENT_TYPE)

        // 检查是否为 POST 请求 (gRPC 使用 POST)
        val isPost = request.method == HttpMethod.POST

        return isPost && hasGrpcContentType
    }

    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        val request = exchange.request

        // 如果是 gRPC 请求
        if (isGrpcRequest(request)) {
            if (log.isDebugEnabled) {
                log.debug("转发 gRPC 请求: {}", request.path.value())
            }
            return super.filter(exchange, chain)
        }

        // 非 gRPC 请求，继续执行过滤器链
        return chain.filter(exchange)
    }


    override fun getOrder(): Int {
        // 在 NettyRoutingFilter 之前执行
        return LOWEST_PRECEDENCE - 1
    }
}

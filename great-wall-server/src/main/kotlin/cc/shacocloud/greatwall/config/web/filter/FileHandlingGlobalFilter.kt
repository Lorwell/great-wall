package cc.shacocloud.greatwall.config.web.filter

import cc.shacocloud.greatwall.model.mo.StaticResourceConfigMo
import cc.shacocloud.greatwall.service.AppRouteLocator
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.GlobalFilter
import org.springframework.cloud.gateway.route.Route
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils
import org.springframework.core.Ordered
import org.springframework.core.io.FileSystemResource
import org.springframework.core.io.buffer.DataBufferUtils
import org.springframework.core.io.buffer.DefaultDataBufferFactory
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.MediaTypeFactory
import org.springframework.stereotype.Component
import org.springframework.web.server.ResponseStatusException
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono
import java.net.URI
import java.nio.file.Files
import java.nio.file.Paths
import kotlin.io.path.toPath

/**
 * 文件处理过滤器，支持处理文件协议
 *
 * @author 思追(shaco)
 */
@Component
class FileHandlingGlobalFilter : GlobalFilter, Ordered {

    override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
        val requestUrl = exchange.getRequiredAttribute<URI>(ServerWebExchangeUtils.GATEWAY_REQUEST_URL_ATTR)

        if (!"file".equals(requestUrl.scheme, ignoreCase = true)) {
            return chain.filter(exchange)
        }

        val route = exchange.getAttribute<Route>(ServerWebExchangeUtils.GATEWAY_ROUTE_ATTR)!!
        var url = requestUrl.path

        val (index, tryfile404) =
            route.metadata[AppRouteLocator.Companion.STATIC_RESOURCE_CONFIG_META_KEY] as StaticResourceConfigMo?
                ?: StaticResourceConfigMo.DEFAULT

        if (url == "/") {
            url = index
        }

        val path = route.uri.toPath()
        var fullPath = path.resolve(Paths.get(url.removePrefix("/"))).normalize()

        // 安全检查
        if (!fullPath.startsWith(path)) {
            return Mono.error(ResponseStatusException(HttpStatus.FORBIDDEN));
        }

        if (!Files.exists(fullPath)) {
            if (tryfile404.isNullOrBlank()) {
                return Mono.error(ResponseStatusException(HttpStatus.NOT_FOUND))
            }

            url = tryfile404
            fullPath = path.resolve(Paths.get(url.removePrefix("/"))).normalize()
            if (!Files.exists(fullPath)) {
                return Mono.error(ResponseStatusException(HttpStatus.NOT_FOUND))
            }
        }

        val response = exchange.response
        val resource = FileSystemResource(fullPath)

        val headers = response.headers
        headers.contentType = MediaTypeFactory.getMediaType(resource)
            .orElse(MediaType.APPLICATION_OCTET_STREAM)

        return DataBufferUtils.read(resource, DefaultDataBufferFactory(true), 4096)
            .collectList()
            .flatMap { buffers ->
                if (buffers.isEmpty()) {
                    headers.contentLength = 0
                    response.setComplete()
                } else {
                    headers.contentLength = buffers.sumOf { it.readableByteCount().toLong() }
                    response.writeWith(Flux.fromIterable(buffers))
                        .doOnError { buffers.forEach(DataBufferUtils::release) }
                }
            }
            .then(chain.filter(exchange))
    }

    override fun getOrder(): Int {
        return Ordered.LOWEST_PRECEDENCE
    }

}
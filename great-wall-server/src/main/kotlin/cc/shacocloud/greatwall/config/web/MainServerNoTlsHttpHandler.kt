package cc.shacocloud.greatwall.config.web

import cc.shacocloud.greatwall.utils.ApplicationContextHolder
import org.springframework.core.env.get
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.server.reactive.HttpHandler
import org.springframework.http.server.reactive.ServerHttpRequest
import org.springframework.http.server.reactive.ServerHttpResponse
import reactor.core.publisher.Mono

/**
 * 非 tls http Handler
 * @author 思追(shaco)
 */
class MainServerNoTlsHttpHandler(
    private val httpHandler: HttpHandler,
    private val mainServerProperties: MainServerProperties
) : HttpHandler {

    override fun handle(request: ServerHttpRequest, response: ServerHttpResponse): Mono<Void> {
        if (mainServerProperties.redirectHttps) {
            val host = request.headers.getFirst(HttpHeaders.HOST)
            val path = request.path.value()

            val tlsPort = ApplicationContextHolder.getInstance().environment["server.port"]!!.toInt()
            response.statusCode = HttpStatus.MOVED_PERMANENTLY
            response.headers.add(HttpHeaders.LOCATION, "https://${host}:${tlsPort}${path}")
            return Mono.empty()
        }

        return httpHandler.handle(request, response)
    }
}
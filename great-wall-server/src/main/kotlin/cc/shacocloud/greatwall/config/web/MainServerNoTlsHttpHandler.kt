package cc.shacocloud.greatwall.config.web

import cc.shacocloud.greatwall.model.Settings
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
    private val httpHandler: HttpHandler
) : HttpHandler {

    private val tlsPort: Int by lazy {
        ApplicationContextHolder.getInstance().environment["server.port"]!!.toInt()
    }

    override fun handle(request: ServerHttpRequest, response: ServerHttpResponse): Mono<Void> {

        // 重定向到 https 端口
        if (Settings.redirectHttps.get()) {
            val host = request.headers.getFirst(HttpHeaders.HOST)
            val path = request.path.value()

            response.statusCode = HttpStatus.MOVED_PERMANENTLY
            response.headers.add(HttpHeaders.LOCATION, "https://${host}:${tlsPort}${path}")
            return response.setComplete()
        }

        return httpHandler.handle(request, response)
    }
}
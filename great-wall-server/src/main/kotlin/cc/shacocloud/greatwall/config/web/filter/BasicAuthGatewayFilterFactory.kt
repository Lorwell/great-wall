package cc.shacocloud.greatwall.config.web.filter

import org.springframework.cloud.gateway.filter.GatewayFilter
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono
import java.util.*

/**
 * basic 认证的网关过滤器工厂
 *
 * @author 思追(shaco)
 */
@Component
class BasicAuthGatewayFilterFactory : AbstractGatewayFilterFactory<BasicAuthGatewayFilterFactory.Config>(
    Config::class.java
) {

    companion object {
        const val DEFAULT_VALUE = "__"
    }

    override fun newConfig(): Config {
        return Config()
    }

    override fun apply(config: Config): GatewayFilter {
        return BasicAuthGatewayFilter(config)
    }

    class Config {
        var username: String = DEFAULT_VALUE
        var password: String = DEFAULT_VALUE
    }

    class BasicAuthGatewayFilter(val config: Config) : GatewayFilter {
        override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
            val request = exchange.request
            val response = exchange.response

            // 如果未设置账号密码
            if (config.username == DEFAULT_VALUE) {
                response.setStatusCode(HttpStatus.FORBIDDEN)
                return response.setComplete()
            }

            val authHeader = request.headers[HttpHeaders.AUTHORIZATION]?.first()

            // 认证
            if (!authHeader.isNullOrBlank()) {
                val ciphertext = authHeader.removePrefix("Basic").trim()
                val plaintext = Base64.getDecoder().decode(ciphertext).decodeToString()
                val split = plaintext.split(":")

                if (split.size == 2 && config.username == split[0] && config.password == split[1]) {
                    return chain.filter(exchange)
                }
            }

            // 认证失败
            response.setStatusCode(HttpStatus.UNAUTHORIZED)
            response.headers[HttpHeaders.WWW_AUTHENTICATE] = "Basic realm=great-wall, charset=\"UTF-8\""
            return response.setComplete()
        }

    }

}
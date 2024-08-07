package cc.shacocloud.greatwall.config.web.filter

import org.springframework.cloud.gateway.filter.GatewayFilter
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

/**
 * 删除响应标头
 * @author 思追(shaco)
 */
@Component
class RemoveResponseHeadersGatewayFilterFactory :
    AbstractGatewayFilterFactory<RemoveResponseHeadersGatewayFilterFactory.Config>(Config::class.java) {

    class Config {
        var headerNames: List<String> = listOf()
    }

    override fun newConfig(): Config {
        return Config()
    }

    override fun apply(config: Config): GatewayFilter {
        return RemoveResponseHeadersGatewayFilter(config)
    }

    class RemoveResponseHeadersGatewayFilter(val config: Config) : GatewayFilter {

        override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
            return chain.filter(exchange).then(Mono.fromRunnable { removeHeader(exchange, config) })
        }

        private fun removeHeader(exchange: ServerWebExchange, config: Config) {
            val response = exchange.response
            if (response.isCommitted) return

            val headers = response.headers
            for (headerName in config.headerNames) {
                headers.remove(headerName)
            }
        }
    }
}
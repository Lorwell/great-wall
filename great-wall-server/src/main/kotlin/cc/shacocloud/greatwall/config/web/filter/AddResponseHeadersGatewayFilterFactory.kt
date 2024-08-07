package cc.shacocloud.greatwall.config.web.filter

import cc.shacocloud.greatwall.model.mo.NameValueMo
import org.springframework.cloud.gateway.filter.GatewayFilter
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

/**
 * 添加响应标头
 * @author 思追(shaco)
 */
@Component
class AddResponseHeadersGatewayFilterFactory :
    AbstractGatewayFilterFactory<AddResponseHeadersGatewayFilterFactory.Config>(Config::class.java) {

    class Config {
        var headers: List<NameValueMo> = listOf()
    }

    override fun newConfig(): Config {
        return Config()
    }

    override fun apply(config: Config): GatewayFilter {
        return AddResponseHeadersGatewayFilter(config)
    }

    class AddResponseHeadersGatewayFilter(val config: Config) : GatewayFilter {

        override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
            return chain.filter(exchange).then(Mono.fromRunnable { addHeader(exchange, config) })
        }

        private fun addHeader(exchange: ServerWebExchange, config: Config) {
            val response = exchange.response
            if (response.isCommitted) return

            val headers = response.headers
            for ((key, value) in config.headers) {
                headers.set(key, value)
            }
        }
    }
}
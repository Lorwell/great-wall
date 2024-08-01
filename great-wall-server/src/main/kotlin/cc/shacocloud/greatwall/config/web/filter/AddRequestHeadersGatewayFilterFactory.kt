package cc.shacocloud.greatwall.config.web.filter

import cc.shacocloud.greatwall.model.mo.NameValueMo
import org.springframework.cloud.gateway.filter.GatewayFilter
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

/**
 * 添加请求头
 * @author 思追(shaco)
 */
@Component
class AddRequestHeadersGatewayFilterFactory :
    AbstractGatewayFilterFactory<AddRequestHeadersGatewayFilterFactory.Config>(Config::class.java) {

    class Config {
        var headers: List<NameValueMo> = listOf()
    }

    override fun newConfig(): Config {
        return Config()
    }

    override fun apply(config: Config): GatewayFilter {
        return AddRequestHeadersGatewayFilter(config)
    }

    class AddRequestHeadersGatewayFilter(val config: Config) : GatewayFilter {

        override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
            val request = exchange.request
                .mutate()
                .headers {
                    for ((key, value) in config.headers) {
                        it.set(key, value)
                    }
                }
                .build()

            return chain.filter(exchange.mutate().request(request).build())
        }

    }
}
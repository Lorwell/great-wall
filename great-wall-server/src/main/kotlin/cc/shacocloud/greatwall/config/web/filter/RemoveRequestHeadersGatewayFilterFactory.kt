package cc.shacocloud.greatwall.config.web.filter

import org.springframework.cloud.gateway.filter.GatewayFilter
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

/**
 * 删除指定请求头
 *
 * @author 思追(shaco)
 */
@Component
class RemoveRequestHeadersGatewayFilterFactory :
    AbstractGatewayFilterFactory<RemoveRequestHeadersGatewayFilterFactory.Config>(Config::class.java) {

    class Config {
        var headerNames: List<String> = listOf()
    }

    override fun newConfig(): Config {
        return Config()
    }

    override fun apply(config: Config): GatewayFilter {
        return RemoveRequestHeadersGatewayFilter(config)
    }

    class RemoveRequestHeadersGatewayFilter(val config: Config) : GatewayFilter {

        override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
            val request = exchange.request
                .mutate()
                .headers {
                    for (headerName in config.headerNames) {
                        it.remove(headerName)
                    }
                }.build()

            return chain.filter(exchange.mutate().request(request).build())
        }

    }


}
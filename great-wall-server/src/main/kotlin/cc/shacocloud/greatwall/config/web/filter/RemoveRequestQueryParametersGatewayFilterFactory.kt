package cc.shacocloud.greatwall.config.web.filter

import org.springframework.cloud.gateway.filter.GatewayFilter
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory
import org.springframework.stereotype.Component
import org.springframework.util.CollectionUtils
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.util.UriComponentsBuilder
import reactor.core.publisher.Mono

/**
 * 删除查询参数
 * @author 思追(shaco)
 */
@Component
class RemoveRequestQueryParametersGatewayFilterFactory
    : AbstractGatewayFilterFactory<RemoveRequestQueryParametersGatewayFilterFactory.Config>(
    Config::class.java
) {

    class Config {
        var paramNames: List<String> = listOf()
    }

    override fun newConfig(): Config {
        return Config()
    }

    override fun apply(config: Config): GatewayFilter {
        return RemoveRequestParametersGatewayFilter(config)
    }

    class RemoveRequestParametersGatewayFilter(val config: Config) : GatewayFilter {
        override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
            val request = exchange.request
            val queryParams = LinkedMultiValueMap(request.queryParams)

            for (paramName in config.paramNames) {
                queryParams.remove(paramName)
            }

            val newUri = UriComponentsBuilder.fromUri(request.uri)
                .replaceQueryParams(CollectionUtils.unmodifiableMultiValueMap(queryParams))
                .build()
                .toUri()

            val updatedRequest = exchange.request.mutate().uri(newUri).build()

            return chain.filter(exchange.mutate().request(updatedRequest).build())
        }
    }
}
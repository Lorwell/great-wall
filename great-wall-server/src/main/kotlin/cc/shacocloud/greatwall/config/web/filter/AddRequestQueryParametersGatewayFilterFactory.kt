package cc.shacocloud.greatwall.config.web.filter

import cc.shacocloud.greatwall.model.mo.NameValueMo
import org.springframework.cloud.gateway.filter.GatewayFilter
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils
import org.springframework.stereotype.Component
import org.springframework.web.server.ServerWebExchange
import org.springframework.web.util.UriComponentsBuilder
import reactor.core.publisher.Mono
import java.util.*

/**
 * 添加查询参数
 * @author 思追(shaco)
 */
@Component
class AddRequestQueryParametersGatewayFilterFactory
    : AbstractGatewayFilterFactory<AddRequestQueryParametersGatewayFilterFactory.Config>(
    Config::class.java
) {

    class Config {
        var params: List<NameValueMo> = listOf()
    }

    override fun newConfig(): Config {
        return Config()
    }

    override fun apply(config: Config): GatewayFilter {
        return AddRequestQueryParametersGatewayFilter(config)
    }

    class AddRequestQueryParametersGatewayFilter(val config: Config) : GatewayFilter {
        override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
            val uri = exchange.request.uri
            var originalQuery = uri.rawQuery

            val query = StringJoiner("&")

            if (originalQuery.isNotBlank()) {
                originalQuery = originalQuery.removeSuffix("&")
                query.add(originalQuery)
            }

            for ((key, value) in config.params) {
                query.add("$key=$value")
            }

            val encoded = ServerWebExchangeUtils.containsEncodedParts(uri)
            try {
                val newUri = UriComponentsBuilder.fromUri(uri)
                    .replaceQuery(query.toString())
                    .build(encoded)
                    .toUri()

                val request = exchange.request.mutate().uri(newUri).build()

                return chain.filter(exchange.mutate().request(request).build())
            } catch (ex: RuntimeException) {
                throw IllegalStateException("无效的 URI 查询参数：$query")
            }
        }
    }
}
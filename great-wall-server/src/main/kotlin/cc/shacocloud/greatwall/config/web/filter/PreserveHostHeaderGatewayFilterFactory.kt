package cc.shacocloud.greatwall.config.web.filter

import org.springframework.cloud.gateway.filter.GatewayFilter
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory
import org.springframework.cloud.gateway.support.ServerWebExchangeUtils
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

/**
 * 是否保留 Host 请求头
 *
 * @author 思追(shaco)
 */
class PreserveHostHeaderGatewayFilterFactory :
    AbstractGatewayFilterFactory<PreserveHostHeaderGatewayFilterFactory.Config>(
        Config::class.java
    ) {

    class Config {

        /**
         * 是否保留，false 不保留，反之保留
         */
        var preserve: Boolean = false
    }

    override fun newConfig(): Config {
        return Config()
    }

    override fun apply(config: Config): GatewayFilter {
        return PreserveHostHeaderGatewayFilter(config)
    }

    class PreserveHostHeaderGatewayFilter(val config: Config) : GatewayFilter {
        override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
            exchange.attributes[ServerWebExchangeUtils.PRESERVE_HOST_HEADER_ATTRIBUTE] = config.preserve
            return chain.filter(exchange)
        }
    }
}
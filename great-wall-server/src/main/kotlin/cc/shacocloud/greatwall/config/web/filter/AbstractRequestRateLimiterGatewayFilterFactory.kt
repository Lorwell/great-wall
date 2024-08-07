package cc.shacocloud.greatwall.config.web.filter

import cc.shacocloud.greatwall.config.web.MainServerErrorHandler
import org.springframework.cloud.gateway.filter.GatewayFilter
import org.springframework.cloud.gateway.filter.GatewayFilterChain
import org.springframework.cloud.gateway.filter.factory.AbstractGatewayFilterFactory
import org.springframework.http.HttpStatus
import org.springframework.http.HttpStatusCode
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono

/**
 * 请求限流抽象类
 *
 * @author 思追(shaco)
 */
abstract class AbstractRequestRateLimiterGatewayFilterFactory<T : AbstractRequestRateLimiterGatewayFilterFactory.Config>
    (
    config: Class<T>,
    private val mainServerErrorHandler: MainServerErrorHandler,
) : AbstractGatewayFilterFactory<T>(config) {

    open class Config {

        /**
         * 触发限流时响应的状态码
         */
        var statusCode: HttpStatusCode = HttpStatus.TOO_MANY_REQUESTS

    }

    /**
     * 速率限制器
     */
    interface RateLimiter {

        /**
         * handler 函数 如果允许执行则返回 true 反之为 false
         */
        fun run(
            handler: (allowed: Boolean) -> Mono<Void>,
        ): Mono<Void>
    }

    /**
     * 根据配置获取速率限制器
     */
    abstract fun getRateLimiter(config: T): RateLimiter

    override fun apply(config: T): GatewayFilter {
        val rateLimiter = getRateLimiter(config)
        return RateLimiterGatewayFilter(config, rateLimiter, mainServerErrorHandler)
    }

    class RateLimiterGatewayFilter(
        val config: Config,
        private val rateLimiter: RateLimiter,
        private val mainServerErrorHandler: MainServerErrorHandler,
    ) : GatewayFilter {

        override fun filter(exchange: ServerWebExchange, chain: GatewayFilterChain): Mono<Void> {
            return rateLimiter.run { acquire ->

                // 允许执行
                if (acquire) {
                    chain.filter(exchange)
                }
                // 拒绝服务
                else {
                    val statusCode = config.statusCode
                    mainServerErrorHandler.handleErrorStatus(exchange, statusCode)
                }
            }
        }
    }

}
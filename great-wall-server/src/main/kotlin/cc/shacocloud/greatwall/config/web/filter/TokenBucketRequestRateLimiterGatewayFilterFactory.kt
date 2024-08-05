package cc.shacocloud.greatwall.config.web.filter

import cc.shacocloud.greatwall.config.web.MainServerErrorHandler
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono
import java.util.concurrent.Semaphore

/**
 * 令牌桶算法速率限制器
 *
 * @author 思追(shaco)
 */
@Component
class TokenBucketRequestRateLimiterGatewayFilterFactory(
    mainServerErrorHandler: MainServerErrorHandler,
) : AbstractRequestRateLimiterGatewayFilterFactory<TokenBucketRequestRateLimiterGatewayFilterFactory.Config>(
    Config::class.java,
    mainServerErrorHandler
) {

    class Config : AbstractRequestRateLimiterGatewayFilterFactory.Config() {

        /**
         * 令牌数量
         */
        var limit: Int = 1000

    }

    /**
     * 令牌桶速率限制器
     */
    class TokenBucketRateLimiter(val config: Config) : RateLimiter {
        private val semaphore = Semaphore(config.limit)

        override fun run(handler: (allowed: Boolean) -> Mono<Void>): Mono<Void> {
            val acquire = semaphore.tryAcquire()
            return handler(acquire).then(Mono.fromRunnable { if (acquire) semaphore.release() })
        }
    }

    override fun getRateLimiter(config: Config): RateLimiter {
        require(config.limit > 0) { "令牌数量必须大于0" }

        return TokenBucketRateLimiter(config)
    }

}
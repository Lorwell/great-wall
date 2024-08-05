package cc.shacocloud.greatwall.config.web.filter

import cc.shacocloud.greatwall.config.web.MainServerErrorHandler
import cc.shacocloud.greatwall.model.constant.WindowUnit
import cc.shacocloud.greatwall.utils.toDuration
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.reactor.mono
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono
import java.util.concurrent.atomic.AtomicInteger

/**
 * 滑动窗口算法速率限制器
 *
 * @author 思追(shaco)
 */
@Component
class SlideWindowRequestRateLimiterGatewayFilterFactory(
    mainServerErrorHandler: MainServerErrorHandler,
) : AbstractRequestRateLimiterGatewayFilterFactory<SlideWindowRequestRateLimiterGatewayFilterFactory.Config>(
    Config::class.java,
    mainServerErrorHandler
) {

    class Config : AbstractRequestRateLimiterGatewayFilterFactory.Config() {

        /**
         * 请求限制数量
         */
        var limit: Int = 10000

        /**
         * 窗口大小
         */
        var window: Int = 1

        /**
         * 窗口单位
         */
        var windowUnit: WindowUnit = WindowUnit.SECONDS

        /**
         * 窗口数量
         */
        var size: Int = 60

    }

    data class WindowNode(
        val seconds: Long,
        var count: Int,
    ) {
        override fun toString(): String {
            return "WindowNode(seconds=$seconds, count=$count)"
        }
    }

    /**
     * 滑动窗口速率限制器
     */
    class SlideWindowRateLimiter(val config: Config) : RateLimiter {

        private val lock = Mutex()

        private val intervalSeconds = config.window.toDuration(config.windowUnit.unit).toSeconds()
        private val size = config.size
        private val limit = config.limit

        val ringWindows: Array<WindowNode>

        private val rightPos = AtomicInteger(0)
        private val leftPos = AtomicInteger(0)
        private val count = AtomicInteger(0)

        init {
            val startSeconds = System.currentTimeMillis() / 1000
            ringWindows = Array(size) { i ->
                WindowNode(
                    seconds = startSeconds + (i * intervalSeconds),
                    count = 0
                )
            }
        }

        /**
         * 重新调整节点
         */
        private fun adjustWindow(currentSeconds: Long) {
            val rightIndex = rightPos.get()
            val leftIndex = leftPos.get()

            var node = ringWindows[rightPos.get()]


        }

        override fun run(handler: (allowed: Boolean) -> Mono<Void>): Mono<Void> = mono {
            var node = ringWindows[rightPos.get()]

            val currentSeconds = System.currentTimeMillis() / 1000

            // 增加窗口
            if (currentSeconds > (node.seconds + intervalSeconds)) {
                lock.withLock {
                    val lastNode = ringWindows[rightPos.get()]
                    if (currentSeconds > (lastNode.seconds + intervalSeconds)) {
                        adjustWindow(currentSeconds)
                    }
                }

                node = ringWindows[rightPos.get()]
            }

            val allowed =
                // 超出并发限制拒绝服务
                if (count.incrementAndGet() > limit) {
                    count.decrementAndGet()
                    false
                }
                // 允许访问
                else {
                    node.count += 1
                    true
                }

            handler(allowed).awaitSingleOrNull()
        }
    }

    override fun getRateLimiter(config: Config): RateLimiter {
        require(config.limit > 0) { "令牌数量必须大于0" }
        require(config.window > 0) { "窗口值必须大于0" }
        require(config.size > 0) { "窗口数量必须大于0" }

        return SlideWindowRateLimiter(config)
    }

}
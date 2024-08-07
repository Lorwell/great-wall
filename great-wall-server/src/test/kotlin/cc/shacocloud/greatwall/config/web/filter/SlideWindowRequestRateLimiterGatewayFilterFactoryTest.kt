package cc.shacocloud.greatwall.config.web.filter

import cc.shacocloud.greatwall.config.web.filter.SlideWindowRequestRateLimiterGatewayFilterFactory.Config
import cc.shacocloud.greatwall.config.web.filter.SlideWindowRequestRateLimiterGatewayFilterFactory.SlideWindowRateLimiter
import cc.shacocloud.greatwall.model.constant.WindowUnit
import cc.shacocloud.greatwall.utils.toDuration
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import reactor.core.publisher.Mono
import java.time.temporal.ChronoUnit
import java.util.concurrent.atomic.AtomicInteger
import java.util.concurrent.atomic.AtomicLong
import kotlin.random.Random

/**
 *
 * @author 思追(shaco)
 */
class SlideWindowRequestRateLimiterGatewayFilterFactoryTest {


    @Test
    fun slideWindowRateLimiterTest() {
        val rateLimiter = SlideWindowRateLimiter(
            Config().apply {
                limit = 100000
                window = 1
                windowUnit = WindowUnit.SECONDS
                size = 10
            }
        )

        val total = AtomicInteger(0)
        val success = AtomicInteger(0)
        val max = AtomicLong(0)
        val min = AtomicLong(0)
        val totalTime = AtomicLong(0)

        runBlocking {

            // 先预热
            repeat(100_000) {
                rateLimiter.run { Mono.just("").then() }.awaitSingleOrNull()
            }
            delay(20 * 1000)

            repeat(10) {

                repeat(Random.nextInt(10000)) {
                    launch {

                        total.incrementAndGet()

                        val start = System.nanoTime()

                        rateLimiter.run { acquire ->

                            val end = System.nanoTime()
                            val time = end - start

                            totalTime.addAndGet(time)

                            if (acquire) {
                                success.incrementAndGet()
                            }

                            if (max.get() < time) {
                                max.set(time)
                            }

                            val minValue = min.get()
                            if (minValue == 0.toLong() || minValue > time) {
                                min.set(time)
                            }

                            Mono.just("").then()
                        }.awaitSingleOrNull()
                    }
                }

                delay(1000)
            }
        }

        println(
            """
                total: ${total.get()}  
                success: ${success.get()}
                max: ${max.get().toDuration(ChronoUnit.NANOS)}
                min: ${min.get().toDuration(ChronoUnit.NANOS)}
                avg: ${(totalTime.get() / total.get()).toDuration(ChronoUnit.NANOS)}
            """.trimIndent()
        )

        val buckets = rateLimiter.getBuckets()
        buckets.forEach {
            println(it)
        }

    }

}
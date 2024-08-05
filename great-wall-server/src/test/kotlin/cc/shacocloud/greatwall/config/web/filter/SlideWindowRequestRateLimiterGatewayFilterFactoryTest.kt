package cc.shacocloud.greatwall.config.web.filter

import cc.shacocloud.greatwall.config.web.filter.SlideWindowRequestRateLimiterGatewayFilterFactory.Config
import cc.shacocloud.greatwall.config.web.filter.SlideWindowRequestRateLimiterGatewayFilterFactory.SlideWindowRateLimiter
import cc.shacocloud.greatwall.model.constant.WindowUnit
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.reactor.mono
import kotlinx.coroutines.runBlocking
import org.junit.jupiter.api.Test
import java.util.concurrent.atomic.AtomicInteger

/**
 *
 * @author 思追(shaco)
 */
class SlideWindowRequestRateLimiterGatewayFilterFactoryTest {


    @Test
    fun slideWindowRateLimiterTest() {
        val rateLimiter = SlideWindowRateLimiter(
            Config().apply {
                limit = 100
                window = 1
                windowUnit = WindowUnit.SECONDS
                size = 60
            }
        )

        val total = AtomicInteger(0)
        val success = AtomicInteger(0)

        runBlocking {

            repeat(10) {
                launch {
                    repeat(20) {
                        launch {

                            total.incrementAndGet()

                            rateLimiter.run { acquire ->
                                mono {

                                    if (acquire) {
//                                        val time = LocalDateTime.now().format(DATE_TIME_FORMAT)
//                                        println("$time acquire: $acquire")

                                        success.incrementAndGet()
                                    }

                                    delay(100)
                                }.then()
                            }.awaitSingleOrNull()
                        }
                    }
                }

                delay(1000)
            }
        }

        println("total: ${total.get()}  success: ${success.get()}")

        rateLimiter.ringWindows.forEach {
            println(it)
        }

    }

}
package cc.shacocloud.greatwall.utils

import org.junit.jupiter.api.Test
import java.time.temporal.ChronoUnit

/**
 *
 * @author 思追(shaco)
 */
class TimerCacheTimeTest {

    @Test
    fun test() {
        val default = Time.DEFAULT

        val start = System.nanoTime()

        repeat(1000_000_000) {
            default.getCurrentTimeSeconds()
        }

        val end = System.nanoTime()
        println((end - start).toDuration(ChronoUnit.NANOS).toString())
    }
}
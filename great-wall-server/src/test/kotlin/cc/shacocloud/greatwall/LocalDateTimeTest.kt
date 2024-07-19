package cc.shacocloud.greatwall

import cc.shacocloud.greatwall.utils.OPENSSL_DATE_FORMAT
import cc.shacocloud.greatwall.utils.hours
import cc.shacocloud.greatwall.utils.includedDays
import org.junit.jupiter.api.Test
import java.time.LocalDateTime
import kotlin.time.Duration.Companion.seconds


/**
 *
 * @author 思追(shaco)
 */
class LocalDateTimeTest {

    @Test
    fun test() {
        val dateStr = "Sep  26 18:02:30 2024 GMT"
        val dateTime = LocalDateTime.parse(dateStr, OPENSSL_DATE_FORMAT)
        println(dateTime)
    }

    @Test
    fun includedDays() {
        val end = LocalDateTime.now()
        val start = end - 10.hours
        val days = (start to end).includedDays()
        println(days)

    }


    @Test
    fun durationToStr() {
        println(566456.seconds.toString().replace(" ", ""))
    }
}
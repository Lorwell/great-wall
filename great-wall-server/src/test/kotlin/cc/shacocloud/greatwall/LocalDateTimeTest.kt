package cc.shacocloud.greatwall

import cc.shacocloud.greatwall.utils.OPENSSL_DATE_FORMAT
import cc.shacocloud.greatwall.utils.includedDays
import cc.shacocloud.greatwall.utils.hours
import org.junit.jupiter.api.Test
import java.time.LocalDateTime


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
    fun diffDays() {
        val end = LocalDateTime.now()
        val start = end - 10.hours
        val days = (start to end).includedDays()
        println(days)

    }
}
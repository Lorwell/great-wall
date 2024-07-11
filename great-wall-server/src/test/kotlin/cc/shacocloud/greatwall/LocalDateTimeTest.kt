package cc.shacocloud.greatwall

import cc.shacocloud.greatwall.utils.OPENSSL_DATE_FORMAT
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
}
package cc.shacocloud.greatwall

import cc.shacocloud.greatwall.utils.hours
import cc.shacocloud.greatwall.utils.includedDays
import cc.shacocloud.greatwall.utils.zoneOffset
import org.junit.jupiter.api.Test
import java.time.Instant
import java.time.LocalDateTime
import java.time.Month
import java.time.format.TextStyle
import java.util.*
import kotlin.time.Duration.Companion.seconds


/**
 *
 * @author 思追(shaco)
 */
class LocalDateTimeTest {

    @Test
    fun test() {
        val dateStr = "Nov 21 18:04:14 2024 GMT"
        val chunk = dateStr.split(" ")

        val month = Month.entries.find {
            it.getDisplayName(TextStyle.SHORT, Locale.ENGLISH) == chunk[0]
        }

        val timeChunk = chunk[2].split(":")
        val dateTime = LocalDateTime.of(
            chunk[3].toInt(),
            month!!,
            chunk[1].toInt(),
            timeChunk[0].toInt(),
            timeChunk[1].toInt(),
            timeChunk[2].toInt()
        )
        println(dateTime)

        val offset = TimeZone.getTimeZone(chunk[4]).toZoneId().rules.getOffset(Instant.now())
        val plusSeconds =
            dateTime.minusSeconds(offset.totalSeconds.toLong()).plusSeconds(zoneOffset.totalSeconds.toLong())
        println(plusSeconds)
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
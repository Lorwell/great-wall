package cc.shacocloud.greatwall.utils

import java.time.*
import java.time.format.TextStyle
import java.time.temporal.ChronoUnit
import java.util.*

/**
 * 系统时区的偏移量
 */
val zoneOffset: ZoneOffset by lazy {
    ZoneId.systemDefault().rules.getOffset(Instant.now())
}

inline val Int.nanos: Duration get() = toDuration(ChronoUnit.NANOS)
inline val Int.micros: Duration get() = toDuration(ChronoUnit.MICROS)
inline val Int.millis: Duration get() = toDuration(ChronoUnit.MILLIS)
inline val Int.seconds: Duration get() = toDuration(ChronoUnit.SECONDS)
inline val Int.minutes: Duration get() = toDuration(ChronoUnit.MINUTES)
inline val Int.hours: Duration get() = toDuration(ChronoUnit.HOURS)
inline val Int.days: Duration get() = toDuration(ChronoUnit.DAYS)
inline val Int.weeks: Duration get() = toDuration(ChronoUnit.WEEKS)
inline val Int.months: Duration get() = toDuration(ChronoUnit.MONTHS)
inline val Int.years: Duration get() = toDuration(ChronoUnit.YEARS)

/**
 * [Int] 转为 [Duration]
 */
fun Int.toDuration(unit: ChronoUnit): Duration {
    return Duration.of(toLong(), unit)
}

/**
 * [Long] 转为 [Duration]
 */
fun Long.toDuration(unit: ChronoUnit): Duration {
    return Duration.of(this, unit)
}

/**
 *  [Instant] 减去 [Instant]
 */
operator fun Instant.minus(instant: Instant): Duration {
    return Duration.ofMillis(toEpochMilli() - instant.toEpochMilli())
}


/**
 *  [LocalDateTime] 减去 [LocalDateTime]
 */
operator fun LocalDateTime.minus(localDateTime: LocalDateTime): Duration {
    return Duration.ofSeconds(toEpochSecond() - localDateTime.toEpochSecond())
}


/**
 * 将 1970-01-01T00:00:00Z 纪元开始的秒数转为 [LocalDateTime]
 */
fun Long.toLocalDateTimeByEpochSecond(
    offset: ZoneOffset = zoneOffset,
): LocalDateTime {
    return LocalDateTime.ofEpochSecond(this, 0, offset)
}

/**
 * 转为 [LocalDateTime]
 */
fun Instant.toLocalDateTime(): LocalDateTime {
    return LocalDateTime.ofInstant(this, ZoneId.systemDefault())
}

/**
 * 将此日期时间转换为从 1970-01-01T00:00:00Z 纪元开始的秒数。使用当前系统时区
 */
fun LocalDateTime.toEpochSecond(): Long {
    return toEpochSecond(zoneOffset)
}

/**
 * 将此日期时间转换为从 1970-01-01T00:00:00Z 纪元开始的毫秒数。使用当前系统时区
 */
fun LocalDateTime.toEpochMilli(): Long {
    return toInstant(zoneOffset).toEpochMilli()
}

/**
 * 将此 [LocalDateTime] 转为 [Date]
 */
fun LocalDateTime.toDate(): Date {
    return Date.from(toInstant(zoneOffset))
}

/**
 * 计算 2个 [LocalDateTime] 之间包含的的天数，如果是在同一天则为 0
 */
fun Pair<LocalDateTime, LocalDateTime>.includedDays(abs: Boolean = true): Long {
    var (from, to) = this
    from = LocalDateTime.of(from.toLocalDate(), LocalTime.MIN)
    to = LocalDateTime.of(to.toLocalDate(), LocalTime.MAX)

    return if (from > to) {
        if (abs) {
            (from - to).toDays()
        } else {
            -((from - to).toDays())
        }
    } else {
        (to - from).toDays()
    }

}

/**
 * openssl 时间格式话
 */
fun String.opensslDateFormat(): LocalDateTime {
    val chunk = split(" ")

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

    // 转为当前时区的时间
    val offset = TimeZone.getTimeZone(chunk[4]).toZoneId().rules.getOffset(Instant.now())
    return dateTime.minusSeconds(offset.totalSeconds.toLong()).plusSeconds(zoneOffset.totalSeconds.toLong())
}
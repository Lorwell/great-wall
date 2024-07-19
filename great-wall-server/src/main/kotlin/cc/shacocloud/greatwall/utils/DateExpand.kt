package cc.shacocloud.greatwall.utils

import java.time.*
import java.time.temporal.ChronoUnit
import java.util.*

/**
 * 系统时区的偏移量
 */
val zoneOffset: ZoneOffset by lazy {
    ZoneId.systemDefault().rules.getOffset(Instant.now())
}

/**
 * 系统时区 0 偏移，一般用于时间已经是当前时区的转换
 */
val zone0Offset: ZoneOffset = ZoneOffset.ofTotalSeconds(0)

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
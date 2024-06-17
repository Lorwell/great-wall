package cc.shacocloud.greatwall.utils

import kotlinx.datetime.*
import kotlin.math.abs
import kotlin.time.DurationUnit

/**
 * 计算 2个 [Instant] 之间相差的天数，如果是在同一天则为 0
 */
fun Pair<Instant, Instant>.diffDayByInstant(
    abs: Boolean = true
): Int {
    val (from, to) = this
    val days = (to - from).toInt(DurationUnit.DAYS)
    return if (abs) abs(days) else days
}

/**
 * 转为 [LocalDateTime]
 */
fun Instant.toLocalDateTime(): LocalDateTime {
    return toLocalDateTime(TimeZone.currentSystemDefault())
}

/**
 * 计算 2个 [LocalDateTime] 之间相差的天数，如果是在同一天则为 0
 */
fun Pair<LocalDateTime, LocalDateTime>.diffDayByLocalDateTime(
    abs: Boolean = true
): Int {
    val (from, to) = this
    val zone = TimeZone.currentSystemDefault()
    val days = (to.toInstant(zone) - from.toInstant(zone)).toInt(DurationUnit.DAYS)
    return if (abs) abs(days) else days
}
package cc.shacocloud.greatwall.utils

import kotlinx.datetime.Instant
import kotlin.math.abs
import kotlin.time.DurationUnit

/**
 * 计算 2个 [Instant] 之间相差的天数，如果是在同一天则为 0
 */
fun Pair<Instant, Instant>.diffDay(
    abs: Boolean = true
): Int {
    val (from, to) = this
    val days = (to - from).toInt(DurationUnit.DAYS)
    return if (abs) abs(days) else days
}
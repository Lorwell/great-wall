package cc.shacocloud.greatwall.model.constant

import java.time.temporal.ChronoUnit

/**
 *
 * @author 思追(shaco)
 */
enum class WindowUnit(
    val unit: ChronoUnit,
) {
    SECONDS(ChronoUnit.SECONDS),
    MINUTES(ChronoUnit.MINUTES),
    HOURS(ChronoUnit.HOURS)
}
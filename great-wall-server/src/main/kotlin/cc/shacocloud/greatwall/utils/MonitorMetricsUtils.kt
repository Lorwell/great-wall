package cc.shacocloud.greatwall.utils

import cc.shacocloud.greatwall.model.dto.output.LineMetricsOutput
import kotlinx.datetime.*
import kotlinx.datetime.format.DateTimeFormat
import kotlin.time.DurationUnit
import kotlin.time.toDuration

enum class DateRangeDurationUnit(
    val unit: DurationUnit,
    val format: DateTimeFormat<LocalDateTime>,
    val outputFormat: DateTimeFormat<LocalDateTime>
) {
    SECONDS(DurationUnit.SECONDS, DATE_TIME_FORMAT, TIME_SECOND_FORMAT),
    MINUTES(DurationUnit.MINUTES, DATE_TIME_MINUTE_FORMAT, TIME_DAY_MINUTE_FORMAT),
    HOURS(DurationUnit.HOURS, DATE_TIME_HOUR_FORMAT, TIME_DAY_HOUR_FORMAT),
    DAYS(DurationUnit.DAYS, DATE_TIME_DAY_FORMAT, DATE_TIME_DAY_FORMAT);
}

data class LineMetricsIntervalConf(
    val prefixFormat: String,
    val extractFunc: String,
    val truncFunc: String,
)

/**
 * 监控指标工具
 * @author 思追(shaco)
 */
object MonitorMetricsUtils {


    /**
     * 时间范围数据补全
     * @param unit 时间单位
     * @param range 时间范围
     * @param sourceData 源数据
     */
    fun <T : LineMetricsOutput, R> dateRangeDataCompletion(
        interval: Int,
        unit: DateRangeDurationUnit,
        range: Pair<Instant, Instant?>,
        sourceData: List<T>,
        transform: (T?, String) -> R
    ): List<R> {
        val timeZone = TimeZone.currentSystemDefault()
        val durationUnit = unit.unit

        // 计算差值
        var (from, to) = range
        to = to ?: Clock.System.now()

        val modulusDurationUnit =
            if (DurationUnit.DAYS == durationUnit) {
                durationUnit
            } else {
                DurationUnit.entries[durationUnit.ordinal + 1]
            }

        val modulus = 1.toDuration(modulusDurationUnit).toLong(DurationUnit.MILLISECONDS)
        from = Instant.fromEpochMilliseconds(from.toEpochMilliseconds() / modulus * modulus)
        val gap = (to - from).toLong(durationUnit)
        val number = gap / interval + if (gap % interval > 0) 1 else 0

        val unitMap = sourceData.associateBy { it.unit }
        return (0..number).map { i ->
            val time = (from + (i * interval).toDuration(durationUnit)).toLocalDateTime(timeZone)
            val valueUnit = time.format(unit.format)
            transform(unitMap[valueUnit], time.format(unit.outputFormat))
        }
    }

}
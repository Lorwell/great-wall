package cc.shacocloud.greatwall.utils

import cc.shacocloud.greatwall.model.dto.input.RouteLineMetricsInput
import cc.shacocloud.greatwall.model.dto.output.LineMetricsOutput
import kotlinx.datetime.Instant
import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.format
import kotlinx.datetime.format.DateTimeFormat
import kotlin.time.DurationUnit
import kotlin.time.toDuration

enum class DateRangeDurationUnit(
    val unit: DurationUnit,
    val format: DateTimeFormat<LocalDateTime>,
) {
    SECONDS(DurationUnit.SECONDS, TIME_SECOND_FORMAT),
    MINUTES(DurationUnit.MINUTES, TIME_DAY_MINUTE_FORMAT),
    HOURS(DurationUnit.HOURS, TIME_DAY_HOUR_FORMAT),
    DAYS(DurationUnit.DAYS, DATE_TIME_DAY_FORMAT);
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
     * @param sourceData 源数据
     */
    fun <T : LineMetricsOutput, R> dateRangeDataCompletion(
        input: RouteLineMetricsInput,
        sourceData: List<T>,
        transform: (T?, String) -> R
    ): List<R> {
        val interval = input.rawInterval
        val unit = input.rawIntervalType
        val durationUnit = unit.unit

        // 计算差值
        var (from, to) = input.getDateRangeMs()

        val furtherUnit = input.getFurtherUnit()
        val modulus = 1.toDuration(furtherUnit.unit).toLong(DurationUnit.MILLISECONDS)

        from = Instant.fromEpochMilliseconds(from.toEpochMilliseconds() / modulus * modulus)
        val gap = (to - from).toLong(durationUnit)
        val number = gap / interval + if (gap % interval > 0) 1 else 0

        val unitMap = sourceData.associateBy { it.unit }
        return (0..number).map { i ->
            val time = (from + (i * interval).toDuration(durationUnit))
            val valueUnit = time.toLocalDateTime().format(unit.format)
            val t = unitMap[valueUnit]
            transform(t, valueUnit)
        }
    }

}
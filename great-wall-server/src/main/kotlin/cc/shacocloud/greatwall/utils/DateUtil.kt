package cc.shacocloud.greatwall.utils

import cc.shacocloud.greatwall.model.dto.output.LineMetricsOutput
import kotlinx.datetime.*
import kotlinx.datetime.format.DateTimeFormat
import kotlin.time.DurationUnit
import kotlin.time.toDuration

enum class DateRangeDurationUnit(
    val unit: DurationUnit,
    val format: DateTimeFormat<LocalDateTime>
) {
    SECONDS(DurationUnit.SECONDS, DATE_TIME_FORMAT),
    HOURS(DurationUnit.HOURS, DATE_TIME_MINUTE_FORMAT),
    MINUTES(DurationUnit.MINUTES, DATE_TIME_HOUR_FORMAT),
    DAYS(DurationUnit.DAYS, DATE_TIME_DAY_FORMAT);
}

/**
 * 时间工具
 * @author 思追(shaco)
 */
object DateUtil {

    /**
     * 时间范围数据补全
     * @param unit 时间单位
     * @param range 时间范围
     * @param sourceData 源数据
     */
    fun dateRangeDataCompletion(
        unit: DateRangeDurationUnit,
        range: Pair<Instant, Instant?>,
        sourceData: List<LineMetricsOutput>
    ): List<LineMetricsOutput> {
        // 计算差值
        val (from, to) = range
        val duration = (to ?: Clock.System.now()) - from

        val timeZone = TimeZone.currentSystemDefault()
        val unitMap = sourceData.associateBy { it.unit }
        return (0..duration.toLong(unit.unit)).map { i ->
            val valueUnit = (from + i.toDuration(unit.unit)).toLocalDateTime(timeZone).format(unit.format)
            unitMap[valueUnit] ?: LineMetricsOutput(valueUnit, 0)
        }
    }

}
package cc.shacocloud.greatwall.utils

import cc.shacocloud.greatwall.model.dto.input.LineMetricsInput
import cc.shacocloud.greatwall.model.dto.output.LineMetricsOutput
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit

enum class DateRangeDurationUnit(
    val unit: ChronoUnit,
    val format: DateTimeFormatter
) {
    SECONDS(ChronoUnit.SECONDS, TIME_SECOND_FORMAT),
    MINUTES(ChronoUnit.MINUTES, TIME_DAY_MINUTE_FORMAT),
    HOURS(ChronoUnit.HOURS, TIME_DAY_HOUR_FORMAT),
    DAYS(ChronoUnit.DAYS, DATE_TIME_DAY_FORMAT);
}

/**
 * 监控指标工具
 * @author 思追(shaco)
 */
object MonitorMetricsUtils {

    /**
     * 时间范围数据补全
     * @param sourceData 源数据
     */
    fun <R>  dateRangeDataCompletion(
        input: LineMetricsInput,
        transform: (String) -> R
    ): List<R> {
        val interval = input.rawInterval
        val unit = input.rawIntervalType
        val durationUnit = unit.unit

        // 计算差值
        var (from, to) = input.getDateRange()

        val modulus = input.getIntervalSecond()
        from = (from.toEpochSecond() / modulus * modulus).toLocalDateTimeByEpochSecond()
        val gap = (to - from).toSeconds() / durationUnit.duration.toSeconds()
        val number = gap / interval + if (gap % interval > 0) 1 else 0

        return (0..number).map { i ->
            val time = (from + (i * interval).toDuration(durationUnit)).format(unit.format)
            transform(time)
        }
    }

    /**
     * 折线图时间范围数据补全
     * @param sourceData 源数据
     */
    fun <T : LineMetricsOutput, R> lineMetricsDateRangeDataCompletion(
        input: LineMetricsInput,
        sourceData: List<T>,
        transform: (T?, String) -> R
    ): List<R> {
        val unitMap = sourceData.associateBy { it.unit }
        return dateRangeDataCompletion(input) {
            transform(unitMap[it], it)
        }
    }

}
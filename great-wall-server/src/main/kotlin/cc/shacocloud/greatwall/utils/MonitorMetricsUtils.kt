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
    MINUTES(DurationUnit.MINUTES, DATE_TIME_HOUR_FORMAT),
    HOURS(DurationUnit.HOURS, DATE_TIME_MINUTE_FORMAT),
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
     * @param unit 时间单位
     * @param range 时间范围
     * @param sourceData 源数据
     */
    fun dateRangeDataCompletion(
        interval: Int,
        unit: DateRangeDurationUnit,
        range: Pair<Instant, Instant?>,
        sourceData: List<LineMetricsOutput>
    ): List<LineMetricsOutput> {
        val timeZone = TimeZone.currentSystemDefault()

        // 计算差值
        val (from, to) = range

        val number = ((to ?: Clock.System.now()) - from).toLong(unit.unit) / interval

        val unitMap = sourceData.associateBy { it.unit }
        return (0..number).map { i ->
            val time = (from + (i * interval).toDuration(unit.unit)).toLocalDateTime(timeZone)
            val valueUnit = time.format(unit.format)
            unitMap[valueUnit] ?: LineMetricsOutput(valueUnit, 0)
        }
    }

}
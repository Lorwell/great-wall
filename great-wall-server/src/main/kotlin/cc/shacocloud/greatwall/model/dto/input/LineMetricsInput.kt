package cc.shacocloud.greatwall.model.dto.input

import cc.shacocloud.greatwall.utils.DateRangeDurationUnit
import cc.shacocloud.greatwall.utils.toDuration
import jakarta.validation.constraints.Min

/**
 * 折线图统计监控入参
 * @author 思追(shaco)
 */
open class LineMetricsInput(
    override val type: Type,
    override val lastDataEnum: LastDateEnum?,
    override val dateRange: DateRange?,

    /**
     * 间隔
     */
    @field:Min(value = 1)
    open val interval: Int,

    /**
     * 间隔类型
     */
    open val intervalType: DateRangeDurationUnit,

    ) : MetricsDateRangeInput(type, lastDataEnum, dateRange) {

    val rawInterval by lazy {
        val second = getIntervalSecond()
        val unit = rawIntervalType
        second / 1.toDuration(unit.unit).toSeconds()
    }

    val rawIntervalType by lazy {
        val second = getIntervalSecond()
        DateRangeDurationUnit.entries
            .map { it to 1.toDuration(it.unit).toSeconds() }
            .filter { (_, value) -> value <= second }
            .maxByOrNull { (_, value) -> value }
            ?.let { (unit, _) -> unit }
            ?: DateRangeDurationUnit.SECONDS
    }


    /**
     * 获取间隔的秒数
     */
    fun getIntervalSecond(): Long {
        val seconds = interval.toDuration(intervalType.unit).toSeconds()
        // 最小间隔15秒
        return seconds.coerceAtLeast(15)
    }

    /**
     * 获取比间隔时间单位大一个的单位
     */
    fun getFurtherUnit(): DateRangeDurationUnit {
        val second = getIntervalSecond()
        return DateRangeDurationUnit.entries
            .map { it to 1.toDuration(it.unit).toSeconds() }
            .filter { (_, value) -> value > second }
            .minByOrNull { (_, value) -> value }
            ?.let { (unit, _) -> unit }
            ?: DateRangeDurationUnit.DAYS
    }

}
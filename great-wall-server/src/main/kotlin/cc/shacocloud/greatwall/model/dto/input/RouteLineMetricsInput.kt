package cc.shacocloud.greatwall.model.dto.input

import cc.shacocloud.greatwall.model.mo.MetricsDateRange
import cc.shacocloud.greatwall.utils.DateRangeDurationUnit
import jakarta.validation.constraints.Min
import kotlin.time.DurationUnit
import kotlin.time.toDuration

/**
 * 路由统计监控
 * @author 思追(shaco)
 */
open class RouteLineMetricsInput(
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
    open val intervalType: DateRangeDurationUnit

) : MetricsDateRange(type, lastDataEnum, dateRange) {

    val rawInterval by lazy {
        val second = getIntervalSecond()
        val unit = rawIntervalType
        second / 1.toDuration(unit.unit).toLong(DurationUnit.SECONDS)
    }

    val rawIntervalType by lazy {
        val second = getIntervalSecond()
        DateRangeDurationUnit.entries
            .map { it to 1.toDuration(it.unit).toLong(DurationUnit.SECONDS) }
            .filter { (_, value) -> value <= second }
            .maxByOrNull { (_, value) -> value }
            ?.let { (unit, _) -> unit }
            ?: DateRangeDurationUnit.SECONDS
    }


    /**
     * 获取间隔的秒数
     */
    fun getIntervalSecond(): Long {
        return interval.toDuration(intervalType.unit).toLong(DurationUnit.SECONDS)
    }

    /**
     * 获取比间隔时间单位大一个的单位
     */
    fun getFurtherUnit(): DateRangeDurationUnit {
        val second = getIntervalSecond()
        return DateRangeDurationUnit.entries
            .map { it to 1.toDuration(it.unit).toLong(DurationUnit.SECONDS) }
            .filter { (_, value) -> value > second }
            .minByOrNull { (_, value) -> value }
            ?.let { (unit, _) -> unit }
            ?: DateRangeDurationUnit.DAYS
    }

}
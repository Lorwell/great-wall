package cc.shacocloud.greatwall.model.dto.input

import cc.shacocloud.greatwall.model.mo.MetricsDateRange
import cc.shacocloud.greatwall.utils.DateRangeDurationUnit
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min

/**
 * 路由统计监控
 * @author 思追(shaco)
 */
data class TopRouteLineMetricsInput(
    override val type: Type,
    override val lastDataEnum: LastDateEnum?,
    override val dateRange: DateRange?,

    /**
     * 间隔
     */
    @field:Min(value = 1)
    val interval: Int,

    /**
     * 间隔类型
     */
    val intervalType: DateRangeDurationUnit,

    @field:Min(value = 5)
    @field:Max(value = 100)
    val top: Int

) : MetricsDateRange(type, lastDataEnum, dateRange)
package cc.shacocloud.greatwall.model.dto.input

import cc.shacocloud.greatwall.model.mo.MetricsDateRange
import cc.shacocloud.greatwall.utils.DateRangeDurationUnit
import jakarta.validation.constraints.Min

/**
 * 路由统计监控
 * @author 思追(shaco)
 */
data class RouteLineMetricsInput(
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
    val intervalType: DateRangeDurationUnit

) : MetricsDateRange(type, lastDataEnum, dateRange)
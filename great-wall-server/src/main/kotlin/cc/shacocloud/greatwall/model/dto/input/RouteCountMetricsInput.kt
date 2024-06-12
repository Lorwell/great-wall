package cc.shacocloud.greatwall.model.dto.input

import cc.shacocloud.greatwall.model.mo.MetricsDateRange

/**
 * 路由统计监控
 * @author 思追(shaco)
 */
data class RouteCountMetricsInput(
    override val type: Type,
    override val lastDataEnum: LastDateEnum?,
    override val dateRange: DateRange?
) : MetricsDateRange(type, lastDataEnum, dateRange)

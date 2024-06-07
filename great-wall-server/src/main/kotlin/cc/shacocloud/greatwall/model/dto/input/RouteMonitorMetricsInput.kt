package cc.shacocloud.greatwall.model.dto.input

import cc.shacocloud.greatwall.model.mo.MetricsDateRange

/**
 * 路由指标监控
 * @author 思追(shaco)
 */
data class RouteMonitorMetricsInput(
    override val type: Type,
    override val lastDataEnum: LastDateEnum?,
    override val dateRange: DateRange?
) : MetricsDateRange(type, lastDataEnum, dateRange)

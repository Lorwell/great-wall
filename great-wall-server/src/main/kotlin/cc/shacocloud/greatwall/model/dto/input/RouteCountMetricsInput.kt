package cc.shacocloud.greatwall.model.dto.input

/**
 * 路由统计监控
 * @author 思追(shaco)
 */
data class RouteCountMetricsInput(
    override val type: Type,
    override val lastDataEnum: LastDateEnum?,
    override val dateRange: DateRange?
) : MetricsDateRangeInput(type, lastDataEnum, dateRange)

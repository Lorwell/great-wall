package cc.shacocloud.greatwall.model.dto.input

import cc.shacocloud.greatwall.utils.DateRangeDurationUnit
import jakarta.validation.constraints.Min

/**
 *
 * @author 思追(shaco)
 */
open class RouteLineMetricsInput(
    override val type: Type,
    override val lastDataEnum: LastDateEnum?,
    override val dateRange: DateRange?,
    @field:Min(value = 15)
    override val interval: Int,
    override val intervalType: DateRangeDurationUnit,
    open val appRouteId: Long? = null,
) : LineMetricsInput(type, lastDataEnum, dateRange, interval, intervalType)

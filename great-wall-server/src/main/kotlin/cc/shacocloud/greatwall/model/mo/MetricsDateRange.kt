package cc.shacocloud.greatwall.model.mo

import cc.shacocloud.greatwall.controller.exception.BadRequestException
import cc.shacocloud.greatwall.model.mo.MetricsDateRange.LastDateEnum.*
import cc.shacocloud.greatwall.model.mo.MetricsDateRange.Type.lastDateEnum
import kotlinx.datetime.Clock
import java.util.*
import kotlin.time.Duration.Companion.days
import kotlin.time.Duration.Companion.hours
import kotlin.time.Duration.Companion.minutes

/**
 * 指标时间范围
 * @author 思追(shaco)
 */
open class MetricsDateRange(
    open val type: Type,
    open val lastDataEnum: LastDateEnum?,
    open val dateRange: DateRange?
) {

    /**
     * 参数检查
     */
    fun check() {
        when (type) {
            Type.dateRange -> if (dateRange == null) {
                throw BadRequestException("类型为 $type 的查询，dateRange 条件不可以为空！")
            }

            lastDateEnum -> if (lastDataEnum == null) {
                throw BadRequestException("类型为 $type 的查询，lastDataEnum 条件不可以为空！")
            }
        }
    }

    /**
     * 获取时间范围的毫秒数
     */
    fun getDateRangeMs(): Pair<Long, Long?> {
        check()
        return when (type) {
            Type.dateRange -> {
                val range = dateRange!!
                range.from.time to range.to?.time
            }

            lastDateEnum -> {
                val from = when (lastDataEnum!!) {
                    last15Minute -> Clock.System.now() - 15.minutes
                    last30Minute -> Clock.System.now() - 30.minutes
                    last1Hour -> Clock.System.now() - 1.hours
                    last3Hour -> Clock.System.now() - 3.hours
                    last6Hour -> Clock.System.now() - 6.hours
                    last12Hour -> Clock.System.now() - 12.hours
                    last1Day -> Clock.System.now() - 1.days
                    last3Day -> Clock.System.now() - 3.days
                    last7Day -> Clock.System.now() - 7.days
                    last15Day -> Clock.System.now() - 15.days
                }

                from.toEpochMilliseconds() to null
            }
        }
    }

    data class DateRange(
        val from: Date,
        val to: Date?
    )

    enum class Type {
        dateRange,
        lastDateEnum
    }

    enum class LastDateEnum {
        last15Minute,
        last30Minute,
        last1Hour,
        last3Hour,
        last6Hour,
        last12Hour,
        last1Day,
        last3Day,
        last7Day,
        last15Day
    }
}




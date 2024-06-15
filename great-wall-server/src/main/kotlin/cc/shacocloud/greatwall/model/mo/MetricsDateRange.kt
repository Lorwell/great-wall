package cc.shacocloud.greatwall.model.mo

import cc.shacocloud.greatwall.controller.exception.BadRequestException
import cc.shacocloud.greatwall.model.mo.MetricsDateRange.Type.LastDateEnum
import cc.shacocloud.greatwall.utils.AppUtil.timeZoneOffset
import cc.shacocloud.greatwall.utils.DATE_TIME_FORMAT
import kotlinx.datetime.*
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
            Type.DateRange -> if (dateRange == null) {
                throw BadRequestException("类型为 $type 的查询，DateRange 条件不可以为空！")
            }

            LastDateEnum -> if (lastDataEnum == null) {
                throw BadRequestException("类型为 $type 的查询，lastDataEnum 条件不可以为空！")
            }
        }
    }

    /**
     * 获取时间范围的毫秒数
     */
    fun getDateRange(): Pair<LocalDateTime, LocalDateTime> {
        val timeZone = TimeZone.currentSystemDefault()

        val (from, to) = getDateRangeMs()
        return from.toLocalDateTime(timeZone) to to.toLocalDateTime(timeZone)
    }

    /**
     * 获取时间范围的毫秒数
     */
    fun getDateRangeMs(): Pair<Instant, Instant> {
        check()
        val timeZone = TimeZone.currentSystemDefault()
        return when (type) {
            Type.DateRange -> {
                val range = dateRange!!
                val form = range.from.toLocalDateTime(timeZone).toInstant(timeZone)
                val to = (range.to ?: Clock.System.now()).toLocalDateTime(timeZone).toInstant(timeZone)
                form to to

            }

            LastDateEnum -> {
                val from = lastDataEnum!!.toInstant()
                val to = Clock.System.now().toLocalDateTime(timeZone).toInstant(timeZone)
                from to to
            }
        }
    }

    /**
     * 获取 quest db 中时间查询片段
     */
    fun getQuestDBDateFilterFragment(field: String): String {
        val (form, to) = getDateRange()

        val zoneOffset = timeZoneOffset()
        return if (to != null) {
            """to_timezone($field, '$zoneOffset') 
                |between '${form.format(DATE_TIME_FORMAT)}' and '${to.format(DATE_TIME_FORMAT)}'""".trimMargin()
        } else {
            "to_timezone($field, '$zoneOffset')  >= '${form.format(DATE_TIME_FORMAT)}'"
        }
    }

    data class DateRange(
        val from: Instant,
        val to: Instant?
    )

    enum class Type {
        DateRange,
        LastDateEnum
    }

    enum class LastDateEnum {
        Last15Minute,
        Last30Minute,
        Last1Hour,
        Last3Hour,
        Last6Hour,
        Last12Hour,
        Last1Day,
        Last3Day,
        Last7Day,
        Last15Day;

        /**
         * 转为时间
         */
        fun toInstant(): Instant {
            val time = when (this) {
                Last15Minute -> Clock.System.now() - 15.minutes
                Last30Minute -> Clock.System.now() - 30.minutes
                Last1Hour -> Clock.System.now() - 1.hours
                Last3Hour -> Clock.System.now() - 3.hours
                Last6Hour -> Clock.System.now() - 6.hours
                Last12Hour -> Clock.System.now() - 12.hours
                Last1Day -> Clock.System.now() - 1.days
                Last3Day -> Clock.System.now() - 3.days
                Last7Day -> Clock.System.now() - 7.days
                Last15Day -> Clock.System.now() - 15.days
            }

            val timeZone = TimeZone.currentSystemDefault()
            return time.toLocalDateTime(timeZone).toInstant(timeZone)
        }
    }
}




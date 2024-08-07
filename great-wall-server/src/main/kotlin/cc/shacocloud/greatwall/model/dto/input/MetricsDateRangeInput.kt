package cc.shacocloud.greatwall.model.dto.input

import cc.shacocloud.greatwall.controller.exception.BadRequestException
import cc.shacocloud.greatwall.model.dto.input.MetricsDateRangeInput.Type.LastDateEnum
import cc.shacocloud.greatwall.utils.days
import cc.shacocloud.greatwall.utils.hours
import cc.shacocloud.greatwall.utils.minutes
import java.time.LocalDateTime

/**
 * 指标时间范围
 * @author 思追(shaco)
 */
open class MetricsDateRangeInput(
    open val type: Type,
    open val lastDataEnum: LastDateEnum?,
    open val dateRange: DateRange?,
) {

    /**
     * 时间范围
     */
    private val dataRange: Pair<LocalDateTime, LocalDateTime> by lazy {
        check()
        when (type) {
            Type.DateRange -> {
                val range = dateRange!!
                val form = range.from
                val to = range.to ?: LocalDateTime.now()
                form to to

            }

            LastDateEnum -> {
                val from = lastDataEnum!!.toDateTime()
                val to = LocalDateTime.now()
                from to to
            }
        }
    }

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
        return dataRange
    }


    data class DateRange(
        val from: LocalDateTime,
        val to: LocalDateTime?,
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
        fun toDateTime(): LocalDateTime {
            return when (this) {
                Last15Minute -> LocalDateTime.now() - 15.minutes
                Last30Minute -> LocalDateTime.now() - 30.minutes
                Last1Hour -> LocalDateTime.now() - 1.hours
                Last3Hour -> LocalDateTime.now() - 3.hours
                Last6Hour -> LocalDateTime.now() - 6.hours
                Last12Hour -> LocalDateTime.now() - 12.hours
                Last1Day -> LocalDateTime.now() - 1.days
                Last3Day -> LocalDateTime.now() - 3.days
                Last7Day -> LocalDateTime.now() - 7.days
                Last15Day -> LocalDateTime.now() - 15.days
            }
        }
    }
}




package cc.shacocloud.greatwall.model.dto.input

import com.fasterxml.jackson.annotation.JsonSubTypes
import com.fasterxml.jackson.annotation.JsonTypeInfo
import jakarta.validation.Valid
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort
import org.springframework.data.relational.core.query.Criteria
import kotlin.jvm.optionals.getOrNull


/**
 * 基础的列表输入模型
 *
 * @author 思追(shaco)
 */
open class BaseListInput {

    /**
     * 分页字段 当前页，从 0 开始
     *
     * 为空或者为负数表示不分页
     */
    var current: Int = -1

    /**
     * 分页字段 页长度
     */
    @field:Min(value = 0)
    @field:Max(value = 1000)
    var size = 30

    /**
     * 排序字段名称
     */
    @Valid
    var orderBy: List<SortInput> = mutableListOf()

    /**
     * 筛选字段名称
     */
    @Valid
    var filters: List<Filter> = mutableListOf()

    /**
     * 搜索关键字
     */
    var keyword: String? = null

    /**
     * 转为分页对象
     */
    fun toPageable(): Pageable {
        val sort = toSort()

        return if (current >= 0) {
            PageRequest.of(current, size, sort)
        } else {
            Pageable.unpaged(sort)
        }
    }

    /**
     * 转为排序对象
     */
    fun toSort(): Sort {
        val orderList = orderBy
            .filter { !it.column.isNullOrBlank() }
            .map {
                Sort.Order(it.direction, it.column!!, it.nullHandling)
            }
        return if (orderList.isEmpty()) Sort.unsorted() else Sort.by(orderList)
    }

    /**
     * 转为过滤条件
     */
    fun toCriteria(vararg columns: String): Criteria {
        var criteria = Criteria.empty()

        // 过滤条件
        val finalFilters = filters
        if (finalFilters.isNotEmpty()) {
            for (filter in finalFilters) {
                criteria = when (filter) {
                    is BetweenFilter -> criteria.and(filter.column).between(filter.from, filter.to)
                    is EqFilter -> criteria.and(filter.column).`is`(filter.value)
                    is GeFilter -> criteria.and(filter.column).greaterThanOrEquals(filter.value)
                    is GtFilter -> criteria.and(filter.column).greaterThan(filter.value)
                    is InFilter -> criteria.and(filter.column).`in`(filter.values)
                    is IsNotNullFilter -> criteria.and(filter.column).isNotNull
                    is IsNullFilter -> criteria.and(filter.column).isNull
                    is LtFilter -> criteria.and(filter.column).lessThan(filter.value)
                    is LeFilter -> criteria.and(filter.column).lessThanOrEquals(filter.value)
                    is LikeFilter -> criteria.and(filter.column).like(filter.query)
                    is NeFilter -> criteria.and(filter.column).not(filter.value)
                }
            }
        }

        // 关键字
        val finalKeyword = keyword
        if (!finalKeyword.isNullOrBlank() && columns.isNotEmpty()) {
            var likeCriteria = Criteria.empty()
            for (column in columns) {
                likeCriteria = likeCriteria.or(column).like(finalKeyword)
            }
            criteria.and(likeCriteria)
        }

        return criteria
    }

    companion object {

        enum class FilterTypeEnum {

            Like, Between, IsNull, IsNotNull, In, Eq, Ne, Gt, Ge, Lt, Le
        }

        @JsonTypeInfo(use = JsonTypeInfo.Id.NAME, include = JsonTypeInfo.As.EXISTING_PROPERTY, property = "type")
        @JsonSubTypes(
            JsonSubTypes.Type(value = LikeFilter::class, name = "Like"),
            JsonSubTypes.Type(value = BetweenFilter::class, name = "Between"),
            JsonSubTypes.Type(value = IsNullFilter::class, name = "IsNull"),
            JsonSubTypes.Type(value = IsNotNullFilter::class, name = "IsNotNull"),
            JsonSubTypes.Type(value = InFilter::class, name = "In"),
            JsonSubTypes.Type(value = EqFilter::class, name = "Eq"),
            JsonSubTypes.Type(value = NeFilter::class, name = "Ne"),
            JsonSubTypes.Type(value = GtFilter::class, name = "Gt"),
            JsonSubTypes.Type(value = GeFilter::class, name = "Ge"),
            JsonSubTypes.Type(value = LtFilter::class, name = "Lt"),
            JsonSubTypes.Type(value = LeFilter::class, name = "Le")
        )
        sealed class Filter(
            var type: FilterTypeEnum
        ) {
            @get:NotBlank
            abstract val column: String
        }

        data class LikeFilter(
            override val column: String,
            @field:NotBlank
            val query: String
        ) : Filter(FilterTypeEnum.Like)

        data class BetweenFilter(
            override val column: String,
            @field:NotNull
            val from: Any,
            @field:NotNull
            val to: Any
        ) : Filter(FilterTypeEnum.Between)

        data class IsNullFilter(
            override val column: String
        ) : Filter(FilterTypeEnum.IsNull)

        data class IsNotNullFilter(
            override val column: String
        ) : Filter(FilterTypeEnum.IsNotNull)

        data class InFilter(
            override val column: String,
            @field:NotEmpty
            val values: List<Any>
        ) : Filter(FilterTypeEnum.In)

        data class EqFilter(
            override val column: String,
            @field:NotNull
            val value: Any
        ) : Filter(FilterTypeEnum.Eq)

        data class NeFilter(
            override val column: String,
            @field:NotNull
            val value: Any
        ) : Filter(FilterTypeEnum.Ne)

        data class GtFilter(
            override val column: String,
            @field:NotNull
            val value: Number
        ) : Filter(FilterTypeEnum.Gt)

        data class GeFilter(
            override val column: String,
            @field:NotNull
            val value: Number
        ) : Filter(FilterTypeEnum.Ge)

        data class LtFilter(
            override val column: String,
            @field:NotNull
            val value: Number
        ) : Filter(FilterTypeEnum.Lt)

        data class LeFilter(
            override val column: String,
            @field:NotNull
            val value: Number
        ) : Filter(FilterTypeEnum.Le)

        class SortInput : HashMap<String, String>() {

            /**
             * 排序字段名称
             */
            var column: String?
                get() {
                    return get("column")
                }
                set(value) {
                    if (value == null) {
                        remove("column")
                    } else {
                        put("column", value)
                    }
                }

            /**
             * 排序方式
             */
            var direction: Sort.Direction?
                get() {
                    val direction = get("direction") ?: return null
                    return Sort.Direction.fromOptionalString(direction).getOrNull()
                }
                set(value) {
                    if (value == null) {
                        remove("direction")
                    } else {
                        put("direction", value.name)
                    }
                }

            /**
             * 排序空值处理
             */
            var nullHandling: Sort.NullHandling
                get() {
                    val nullHandling = get("nullHandling") ?: return Sort.NullHandling.NATIVE
                    return try {
                        Sort.NullHandling.valueOf(nullHandling)
                    } catch (_: Exception) {
                        Sort.NullHandling.NATIVE
                    }
                }
                set(value) {
                    put("nullHandling", value.toString())
                }
        }
    }
}

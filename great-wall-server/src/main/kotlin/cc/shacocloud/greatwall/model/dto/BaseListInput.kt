package cc.shacocloud.greatwall.model.dto

import com.querydsl.core.types.Predicate
import com.querydsl.core.types.dsl.BooleanExpression
import com.querydsl.core.types.dsl.Expressions
import com.querydsl.core.types.dsl.StringPath
import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Pageable
import org.springframework.data.domain.Sort


/**
 * 基础的列表输入模型
 *
 * @author 思追(shaco)
 */
open class BaseListInput {

    companion object {

        val NOTHING: BooleanExpression = Expressions.booleanTemplate("1=1")
    }

    // ---------------------

    /**
     * 分页字段 当前页，从 0 开始
     *
     * 默认为空，不分页
     */
    @field:Min(value = 0)
    var current: Int? = null

    /**
     * 分页字段 页长度
     */
    @field:Min(value = 0)
    @field:Max(value = 1000)
    var size = 30

    /**
     * 排序字段名称
     */
    var orderBy: Array<String>? = null

    /**
     * 排序方式
     */
    var orderDirection: Sort.Direction = Sort.Direction.ASC

    /**
     * 排序空值处理
     */
    var orderNullHandling: Sort.NullHandling = Sort.NullHandling.NATIVE

    /**
     * 搜索关键字
     */
    var keyword: String? = null

    /**
     * 转为分页对象
     */
    fun toPageable(): Pageable {
        return current?.let { PageRequest.of(it, size, toSort()) } ?: Pageable.unpaged()
    }

    /**
     * 转为排序对象
     */
    fun toSort(): Sort {
        val orderList = orderBy?.map { Sort.Order(orderDirection, it, orderNullHandling) } ?: emptyList()
        return if (orderList.isEmpty()) Sort.unsorted() else Sort.by(orderList)
    }

    /**
     * 关键字模糊匹配，多个使用 and 拼接
     */
    fun likeKeyWordAnd(vararg paths: StringPath): Predicate {
        if (keyword.isNullOrBlank() || paths.isEmpty()) return NOTHING

        var expression: BooleanExpression? = null
        for (path in paths) {
            expression = if (expression == null) {
                path.like("%!$keyword%", '!')
            } else {
                expression.and(path.like("%!$keyword%", '!'))
            }
        }

        return expression!!
    }


    /**
     * 关键字模糊匹配，多个使用 or 拼接
     */
    fun likeKeyWordOr(vararg paths: StringPath): Predicate {
        if (keyword.isNullOrBlank() || paths.isEmpty()) return NOTHING

        var expression: BooleanExpression? = null
        for (path in paths) {
            expression = if (expression == null) {
                path.like("%!$keyword%", '!')
            } else {
                expression.or(path.like("%!$keyword%", '!'))
            }
        }

        return expression!!
    }

}

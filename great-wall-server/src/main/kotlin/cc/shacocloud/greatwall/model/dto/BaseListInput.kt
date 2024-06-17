package cc.shacocloud.greatwall.model.dto

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

}

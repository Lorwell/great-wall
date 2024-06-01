package cc.shacocloud.greatwall.controller.specification

/**
 * 分页结果消息
 * @author 思追(shaco)
 */
data class PageRespMsg<T : Any>(

    /**
     * 集合结果记录
     */
    val records: List<T>,

    /**
     * 分页信息
     */
    val page: RespPage

)

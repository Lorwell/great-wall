package cc.shacocloud.greatwall.controller.specification

/**
 * @author 思追(shaco)
 */
data class RespPage(

    /**
     * 当前页码
     */
    var current: Int,

    /**
     * 页长度
     */
    val size: Int,

    /**
     * 总数
     */
    val total: Long

)

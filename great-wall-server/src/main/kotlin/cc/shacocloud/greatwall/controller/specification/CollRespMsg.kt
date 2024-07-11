package cc.shacocloud.greatwall.controller.specification

import java.io.Serializable

/**
 * 集合结果对象
 * @author 思追(shaco)
 */
data class CollRespMsg<T : Any>(

    /**
     * 集合结果记录
     */
    val records: List<T>

) : ResponseMessage, Serializable

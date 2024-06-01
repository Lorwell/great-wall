package cc.shacocloud.greatwall.controller.specification

import java.io.Serializable

/**
 * 结果对象
 *
 * @author 思追(shaco)
 */
data class RespMsg<T : Any>(

    /**
     * 集合结果记录
     */
    val records: T

) : ResponseMessage, Serializable

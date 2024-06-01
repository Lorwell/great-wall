package cc.shacocloud.greatwall.controller.specification

import java.io.Serializable

/**
 * 字段错误结果体
 * @author 思追(shaco)
 */
data class FieldsRespMsg(

    /**
     * 状态码
     */
    @get:JvmName("_code")
    val code: String,

    /**
     * 状态消息
     */
    @get:JvmName("_message")
    val message: String,

    /**
     * 错误的字段，key 为错误字段的路径，value 为对应的错误信息
     */
    val fields: Map<String, List<RespFieldError>>

) : ResponseBusinessMessage, Serializable {

    override fun getCode(): String {
        return this.code
    }

    override fun getMessage(): String {
        return this.message
    }

}

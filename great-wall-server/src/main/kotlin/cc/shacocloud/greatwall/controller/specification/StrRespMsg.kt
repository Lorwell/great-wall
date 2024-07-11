package cc.shacocloud.greatwall.controller.specification

import com.fasterxml.jackson.annotation.JsonInclude
import java.io.Serializable

/**
 * 字符响应消息
 *
 * @author 思追(shaco)
 */
@JsonInclude(JsonInclude.Include.NON_NULL)
data class StrRespMsg(

    /**
     * 状态码
     */
    @get:JvmName("_code")
    val code: String = ResponseBusinessMessage.SUCCESS_CODE,

    /**
     * 状态消息
     */
    @get:JvmName("_message")
    val message: String = ResponseBusinessMessage.SUCCESS_MESSAGE

) : ResponseBusinessMessage, Serializable {

    override fun getCode(): String {
        return this.code
    }

    override fun getMessage(): String {
        return this.message
    }

}

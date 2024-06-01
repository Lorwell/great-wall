package cc.shacocloud.greatwall.controller.specification

/**
 * 字段错误封装对象
 * @author 思追(shaco)
 */
data class RespFieldError(

    /**
     * 状态码
     */
    val code: String,

    /**
     * 状态消息
     */
    val message: String,

    /**
     * 拒绝的值
     */
    var rejectedValue: Any? = null
)

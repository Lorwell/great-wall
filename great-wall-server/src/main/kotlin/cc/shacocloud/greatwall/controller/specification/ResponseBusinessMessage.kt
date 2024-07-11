package cc.shacocloud.greatwall.controller.specification

/**
 * 响应业务消息的顶层接口
 *
 * @author 思追(shaco)
 */
interface ResponseBusinessMessage : ResponseMessage {

    companion object {

        /**
         * 默认的成功状态码
         */
        const val SUCCESS_CODE = "success"

        /**
         * 默认的成功信息
         */
        const val SUCCESS_MESSAGE = "成功"

        val BAD_REQUEST = StrRespMsg("http.status.400", "请求参数无法解析")
        val UNAUTHORIZED = StrRespMsg("http.status.401", "当前未登录")
        val FORBIDDEN = StrRespMsg("http.status.403", "无访问权限")
        val NOT_FOUND = StrRespMsg("http.status.404", "请求资源不存在")
        val METHOD_NOT_ALLOWED = StrRespMsg("http.status.405", "请求资源不支持当前的请求方式")
        val NOT_ACCEPTABLE = StrRespMsg("http.status.406", "请求资源不满足执行条件")
        val CONFLICT = StrRespMsg("http.status.409", "请求资源状态存在冲突")
        val GONE = StrRespMsg("http.status.410", "请求资源已经永久过期")
        val REQUEST_ENTITY_TOO_LARGE = StrRespMsg("http.status.413", "请求体超出限制")
        val REQUEST_URI_TOO_LONG = StrRespMsg("http.status.414", "请求路径超出限制")
        val UNSUPPORTED_MEDIA_TYPE = StrRespMsg("http.status.415", "不支持的请求资源格式")
        val UNPROCESSABLE_ENTITY = StrRespMsg("http.status.422", "请求参数存在语义错误")
        val INTERNAL_SERVER_ERROR = StrRespMsg("http.status.500", "内部服务异常")
        val SERVICE_UNAVAILABLE = StrRespMsg("http.status.503", "服务不可用")
    }

    /**
     * @return 获取响应的code，通常来说这和 [getMessage] 是对应的
     */
    fun getCode(): String {
        return SUCCESS_CODE
    }

    /**
     * @return 获取响应的message信息，通常来说这和 [getCode] 是对应的
     */
    fun getMessage(): String {
        return SUCCESS_MESSAGE
    }

}
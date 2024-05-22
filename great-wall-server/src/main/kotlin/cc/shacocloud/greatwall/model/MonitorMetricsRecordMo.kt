package cc.shacocloud.greatwall.model

import org.springframework.http.HttpCookie

/**
 *
 * @author 思追(shaco)
 */
data class MonitorMetricsRecordMo(

    /**
     * 来源ip
     */
    val ip: String,

    /**
     * 请求的 host
     */
    val host: String,

    /**
     * 请求方式
     */
    val method: String,

    /**
     * 请求上下文路径
     *
     * 上下文路径始终位于路径的开头，并以“/”开头，但不以“/”结尾
     */
    val contextPath: String,

    /**
     * 应用请求路径
     *
     * 上下文路径之后的请求路径部分，通常用于应用程序内的请求映射。
     */
    val appPath: String,

    /**
     * 查询参数
     */
    val queryParams: Map<String, List<String>>,

    /**
     * 客户端发送的 cookie
     */
    val cookies: List<HttpCookie>

)

package cc.shacocloud.greatwall.model.po

import java.time.Instant

/**
 * 请求指标记录
 *
 * @author 思追(shaco)
 */
data class RouteMetricsRecordPo(

    /**
     * 请求关联的应用路由id
     */
    val appRouteId: Long? = null,

    /**
     * 来源ip
     */
    val ip: String,

    /**
     * 请求方式
     */
    val method: String,

    /**
     * 应用请求路径
     *
     * 上下文路径之后的请求路径部分，通常用于应用程序内的请求映射。
     */
    val endpoint: String,

    /**
     * 请求时间，单位 毫秒
     */
    val requestTime: Instant,

    /**
     * 响应时间，单位 毫秒
     */
    val responseTime: Instant,

    /**
     * 请求处理时间
     */
    val handleTime: Long,

    /**
     * 状态码
     */
    val statusCode: Int,

    /**
     * 请求主体长度，单位字节
     */
    val requestBodySize: Long,

    /**
     * 响应主体长度，单位字节
     */
    val responseBodySize: Long

) : BaseMonitorMetricsPo(Type.ROUTE)



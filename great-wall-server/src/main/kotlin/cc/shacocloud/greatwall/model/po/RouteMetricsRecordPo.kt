package cc.shacocloud.greatwall.model.po

/**
 * 请求指标记录
 *
 * @author 思追(shaco)
 */
data class RouteMetricsRecordPo(

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
     * 应用请求路径
     *
     * 上下文路径之后的请求路径部分，通常用于应用程序内的请求映射。
     */
    val appPath: String,

    /**
     * 查询参数
     */
    val queryParams: QueryParamsMetrics,

    /**
     * 请求时间
     */
    val requestTime: Long,

    /**
     * 响应时间
     */
    val responseTime: Long,

    /**
     * 状态码
     */
    val statusCode: Int,

    /**
     * 当前请求匹配上的路由id
     */
    val appRouteId: Long?,

    /**
     * 路由的目标地址
     */
    val targetUrl: String?

) {

    class QueryParamsMetrics : HashMap<String, List<String>>()

}




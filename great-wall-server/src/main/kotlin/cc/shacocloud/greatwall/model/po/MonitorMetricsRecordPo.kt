package cc.shacocloud.greatwall.model.po

import org.springframework.data.annotation.Id
import org.springframework.data.relational.core.mapping.Column
import org.springframework.data.relational.core.mapping.Table
import org.springframework.http.HttpCookie

/**
 * 监控指标记录表
 * @author 思追(shaco)
 */
@Table("monitor_metrics_record")
data class MonitorMetricsRecordPo(

    @Id
    @Column("id")
    val id: Long? = null,

    /**
     * 来源ip
     */
    @Column("ip")
    val ip: String,

    /**
     * 请求的 host
     */
    @Column("host")
    val host: String,

    /**
     * 请求方式
     */
    @Column("method")
    val method: String,

    /**
     * 请求上下文路径
     *
     * 上下文路径始终位于路径的开头，并以“/”开头，但不以“/”结尾
     */
    @Column("context_path")
    val contextPath: String,

    /**
     * 应用请求路径
     *
     * 上下文路径之后的请求路径部分，通常用于应用程序内的请求映射。
     */
    @Column("app_path")
    val appPath: String,

    /**
     * 查询参数
     */
    @Column("query_params")
    val queryParams: QueryParamsMetrics,

    /**
     * 客户端发送的 cookie
     */
    @Column("cookies")
    val cookies: CookiesParamsMetrics,

    /**
     * 请求时间
     */
    @Column("request_time")
    val requestTime: Long,

    /**
     * 响应时间
     */
    @Column("response_time")
    val responseTime: Long,

    /**
     * 状态码
     */
    @Column("status_code")
    val statusCode: Int

)

class QueryParamsMetrics : HashMap<String, List<String>>()
class CookiesParamsMetrics : ArrayList<HttpCookie>()


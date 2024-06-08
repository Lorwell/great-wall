package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.config.questdb.findOne
import cc.shacocloud.greatwall.config.questdb.findOneNotNull
import cc.shacocloud.greatwall.model.dto.input.RouteMonitorMetricsInput
import cc.shacocloud.greatwall.model.dto.output.ValueMetricsOutput
import cc.shacocloud.greatwall.model.po.questdb.RouteMetricsRecordPo
import cc.shacocloud.greatwall.service.RouteMonitorMetricsService
import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import cc.shacocloud.greatwall.utils.json.Json
import io.questdb.cairo.CairoEngine
import io.questdb.std.str.Utf8String
import kotlinx.coroutines.asCoroutineDispatcher
import kotlinx.coroutines.channels.Channel
import org.springframework.stereotype.Service
import java.util.concurrent.Executors


/**
 * 使用 kotlin 协程的 [Channel] 作为队列，消费数据写入 questdb
 *
 * @author 思追(shaco)
 * @see [https://questdb.io/]
 */
@Slf4j
@Service
class RouteMonitorMetricsServiceImpl(
    val cairoEngine: CairoEngine
) : RouteMonitorMetricsService {

    companion object {

        /**
         * 监控指标数据写入调度器
         */
        val MONITOR_METRICS_WRITE_DISPATCHER = Executors.newFixedThreadPool(2)
            .asCoroutineDispatcher()

        /**
         * 监控指标查询调度器
         */
        val MONITOR_METRICS_QUERY_DISPATCHER = Executors.newFixedThreadPool(3)
            .asCoroutineDispatcher()
    }

    /**
     * 添加请求指标记录
     */
    override suspend fun addRouteRecord(record: RouteMetricsRecordPo) {
        try {
            val tableToken = cairoEngine.getTableTokenIfExists("monitor_metrics_record")
            cairoEngine.getWalWriter(tableToken).use { writer ->
                val row = writer.newRow(record.requestTime)
                row.putSym(0, record.ip)
                row.putVarchar(1, Utf8String(record.host))
                row.putSym(2, record.method)
                row.putVarchar(3, Utf8String(record.appPath))
                row.putVarchar(4, Utf8String(Json.encode(record.queryParams)))
                row.putTimestamp(5, record.requestTime)
                row.putTimestamp(6, record.responseTime)
                row.putInt(7, record.statusCode)
                record.appRouteId?.let { row.putLong(8, it) }
                record.targetUrl?.let { row.putVarchar(9, Utf8String(it)) }
                row.putLong(10, record.requestBodySize)
                row.putLong(11, record.responseBodySize)

                row.append()
                writer.commit()
            }
        } catch (e: Exception) {
            if (log.isErrorEnabled) {
                log.error("保存监控指标记录发生例外！", e)
            }
        }
    }

    /**
     * 请求统计指标
     */
    override suspend fun requestCountMetrics(input: RouteMonitorMetricsInput): ValueMetricsOutput {
        val count = cairoEngine.findOneNotNull(
            """
                    SELECT count(*) FROM monitor_metrics_record 
                    WHERE ${input.getQuestDBDateFilterFragment("request_time")}
                """.trimIndent()
        ) { it.getLong(0) }

        return ValueMetricsOutput(count)
    }

    /**
     * ip 统计指标
     */
    override suspend fun ipCountMetrics(input: RouteMonitorMetricsInput): ValueMetricsOutput {
        val count = cairoEngine.findOneNotNull(
            """
                    SELECT count_distinct(ip) FROM monitor_metrics_record 
                    WHERE ${input.getQuestDBDateFilterFragment("request_time")}
                """.trimIndent()
        ) { it.getLong(0) }

        return ValueMetricsOutput(count)
    }

    /**
     * 请求流量指标
     */
    override suspend fun requestTrafficSumMetrics(input: RouteMonitorMetricsInput): ValueMetricsOutput {
        val count = cairoEngine.findOne(
            """
                    SELECT sum(request_body_size) FROM monitor_metrics_record 
                    WHERE ${input.getQuestDBDateFilterFragment("request_time")}
                """.trimIndent()
        ) { it.getLong(0) } ?: 0

        return ValueMetricsOutput(count)
    }

    /**
     * 响应流量指标
     */
    override suspend fun responseTrafficSumMetrics(input: RouteMonitorMetricsInput): ValueMetricsOutput {
        val count = cairoEngine.findOne(
            """
                    SELECT sum(response_body_size) FROM monitor_metrics_record 
                    WHERE ${input.getQuestDBDateFilterFragment("request_time")}
                """.trimIndent()
        ) { it.getLong(0) } ?: 0

        return ValueMetricsOutput(count)
    }

    override suspend fun status4xxCountMetrics(input: RouteMonitorMetricsInput): ValueMetricsOutput {
        val count = cairoEngine.findOneNotNull(
            """
                    SELECT count FROM monitor_metrics_record 
                    WHERE status_code >= 400 AND status_code < 500 
                    AND ${input.getQuestDBDateFilterFragment("request_time")}
                """.trimIndent()
        ) { it.getLong(0) }

        return ValueMetricsOutput(count)
    }

    override suspend fun status5xxCountMetrics(input: RouteMonitorMetricsInput): ValueMetricsOutput {
        val count = cairoEngine.findOneNotNull(
            """
                    SELECT count FROM monitor_metrics_record 
                    WHERE status_code >= 500 
                    AND ${input.getQuestDBDateFilterFragment("request_time")}
                """.trimIndent()
        ) { it.getLong(0) }

        return ValueMetricsOutput(count)
    }
}
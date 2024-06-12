package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.config.questdb.findAll
import cc.shacocloud.greatwall.config.questdb.findOne
import cc.shacocloud.greatwall.config.questdb.findOneNotNull
import cc.shacocloud.greatwall.model.dto.input.RouteCountMetricsInput
import cc.shacocloud.greatwall.model.dto.input.RouteLineMetricsInput
import cc.shacocloud.greatwall.model.dto.output.LineMetricsOutput
import cc.shacocloud.greatwall.model.dto.output.ValueMetricsOutput
import cc.shacocloud.greatwall.model.po.questdb.RouteMetricsRecordPo
import cc.shacocloud.greatwall.service.RouteMonitorMetricsService
import cc.shacocloud.greatwall.utils.AppUtil.timeZoneOffset
import cc.shacocloud.greatwall.utils.DateRangeDurationUnit
import cc.shacocloud.greatwall.utils.LineMetricsIntervalConf
import cc.shacocloud.greatwall.utils.MonitorMetricsUtils.dateRangeDataCompletion
import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import cc.shacocloud.greatwall.utils.json.Json
import io.questdb.cairo.CairoEngine
import io.questdb.std.str.Utf8String
import io.questdb.std.str.Utf8StringSink
import kotlinx.coroutines.channels.Channel
import org.springframework.stereotype.Service


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
    override suspend fun requestCountMetrics(input: RouteCountMetricsInput): ValueMetricsOutput {
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
    override suspend fun ipCountMetrics(input: RouteCountMetricsInput): ValueMetricsOutput {
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
    override suspend fun requestTrafficSumMetrics(input: RouteCountMetricsInput): ValueMetricsOutput {
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
    override suspend fun responseTrafficSumMetrics(input: RouteCountMetricsInput): ValueMetricsOutput {
        val count = cairoEngine.findOne(
            """
                    SELECT sum(response_body_size) FROM monitor_metrics_record 
                    WHERE ${input.getQuestDBDateFilterFragment("request_time")}
                """.trimIndent()
        ) { it.getLong(0) } ?: 0

        return ValueMetricsOutput(count)
    }

    /**
     * 状态码 4xx 统计指标
     */
    override suspend fun status4xxCountMetrics(input: RouteCountMetricsInput): ValueMetricsOutput {
        val count = cairoEngine.findOneNotNull(
            """
                    SELECT count FROM monitor_metrics_record 
                    WHERE status_code >= 400 AND status_code < 500 
                    AND ${input.getQuestDBDateFilterFragment("request_time")}
                """.trimIndent()
        ) { it.getLong(0) }

        return ValueMetricsOutput(count)
    }

    /**
     * 状态码 5xx 统计指标
     */
    override suspend fun status5xxCountMetrics(input: RouteCountMetricsInput): ValueMetricsOutput {
        val count = cairoEngine.findOneNotNull(
            """
                    SELECT count FROM monitor_metrics_record 
                    WHERE status_code >= 500 
                    AND ${input.getQuestDBDateFilterFragment("request_time")}
                """.trimIndent()
        ) { it.getLong(0) }

        return ValueMetricsOutput(count)
    }

    companion object {
        val qpsLineMetricsMap = mapOf(
            DateRangeDurationUnit.SECONDS to LineMetricsIntervalConf("yyyy-MM-dd HH:mm:", "second", "second"),
            DateRangeDurationUnit.MINUTES to LineMetricsIntervalConf("yyyy-MM-dd HH:", "minute", "minute"),
            DateRangeDurationUnit.HOURS to LineMetricsIntervalConf("yyyy-MM-dd ", "hour", "hour"),
            DateRangeDurationUnit.DAYS to LineMetricsIntervalConf("yyyy-MM-", "days_in_month", "day"),
        )
    }

    /**
     * qps 折线图指标
     */
    override suspend fun qpsLineMetrics(input: RouteLineMetricsInput): List<LineMetricsOutput> {
        val interval = input.interval
        val (prefixFormat, extractFunc, truncFunc) = requireNotNull(qpsLineMetricsMap[input.intervalType])

        val result = cairoEngine.findAll(
            """
                    SELECT
                      concat(
                        to_str(trunc_time, '${prefixFormat}'),
                        CASE
                          WHEN ((${extractFunc}(trunc_time) / ${interval}) * ${interval}) > 10 THEN ''
                          ELSE '0'
                        END,
                        (${extractFunc}(trunc_time) / ${interval}) * $interval
                      ) as unit,
                       CASE WHEN sum(value) % $interval > 0 THEN (sum(value) / ${interval}) + 1 
                       ELSE sum(value) / $interval END as value
                    FROM
                      (
                        SELECT
                          date_trunc('${truncFunc}', to_timezone(request_time, '${timeZoneOffset()}')) as trunc_time,
                          count as value
                        FROM
                          monitor_metrics_record
                        WHERE ${input.getQuestDBDateFilterFragment("request_time")}
                        GROUP BY
                          trunc_time
                        ORDER BY
                          trunc_time
                      ) timestamp(trunc_time)
                    GROUP BY
                      unit
                """.trimIndent()
        ) {
            val utf8StrSink = Utf8StringSink()
            it.getStr(0, utf8StrSink)
            LineMetricsOutput(utf8StrSink.toString(), it.getLong(1))
        }

        return dateRangeDataCompletion(interval, input.intervalType, input.getDateRangeMs(), result)
    }
}
package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.config.questdb.findAll
import cc.shacocloud.greatwall.config.questdb.findOne
import cc.shacocloud.greatwall.config.questdb.findOneNotNull
import cc.shacocloud.greatwall.model.dto.input.RouteCountMetricsInput
import cc.shacocloud.greatwall.model.dto.input.RouteLineMetricsInput
import cc.shacocloud.greatwall.model.dto.input.TopRouteLineMetricsInput
import cc.shacocloud.greatwall.model.dto.output.DurationLineMetricsOutput
import cc.shacocloud.greatwall.model.dto.output.QpsLineMetricsOutput
import cc.shacocloud.greatwall.model.dto.output.TopQpsLineMetricsOutput
import cc.shacocloud.greatwall.model.dto.output.ValueMetricsOutput
import cc.shacocloud.greatwall.model.mo.TopQpsLineMetricsMo
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
import kotlin.time.DurationUnit
import kotlin.time.toDuration


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
            val tableToken = cairoEngine.getTableTokenIfExists("route_metrics_record")
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
                    SELECT count(*) FROM route_metrics_record 
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
                    SELECT count_distinct(ip) FROM route_metrics_record 
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
                    SELECT
                     case when value > 0 then total else 0 end
                    FROM
                      (
                        SELECT
                          sum(request_body_size) as total,
                          count as value
                        FROM
                          route_metrics_record
                        WHERE ${input.getQuestDBDateFilterFragment("request_time")}
                      )
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
                    SELECT
                     case when value > 0 then total else 0 end
                    FROM
                      (
                        SELECT
                          sum(response_body_size) as total,
                          count as value
                        FROM
                          route_metrics_record
                        WHERE ${input.getQuestDBDateFilterFragment("request_time")}
                      )
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
                    SELECT count FROM route_metrics_record 
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
                    SELECT count FROM route_metrics_record 
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
    override suspend fun qpsLineMetrics(input: RouteLineMetricsInput): List<QpsLineMetricsOutput> {
        val interval = input.interval
        val intervalType = input.intervalType
        val (prefixFormat, extractFunc, truncFunc) = requireNotNull(qpsLineMetricsMap[intervalType])
        val dateRangeMs = input.getDateRangeMs()

        val second = interval.toDuration(intervalType.unit).toLong(DurationUnit.SECONDS)
        val result = cairoEngine.findAll(
            """
                    SELECT
                      concat(
                        to_str(trunc_time, '${prefixFormat}'),
                        CASE
                          WHEN ((${extractFunc}(trunc_time) / ${interval}) * ${interval}) >= 10 THEN ''
                          ELSE '0'
                        END,
                        (${extractFunc}(trunc_time) / ${interval}) * $interval
                      ) as unit,
                       CASE WHEN sum(value) % $second > 0 THEN (sum(value) / ${second}) + 1 
                       ELSE sum(value) / $second END as value
                    FROM
                      (
                        SELECT
                          date_trunc('${truncFunc}', to_timezone(request_time, '${timeZoneOffset()}')) as trunc_time,
                          count as value
                        FROM
                          route_metrics_record
                        WHERE ${input.getQuestDBDateFilterFragment("request_time")}
                        GROUP BY trunc_time
                      ) timestamp(trunc_time)
                    GROUP BY  unit
                """.trimIndent()
        ) {
            val utf8StrSink = Utf8StringSink()
            it.getStr(0, utf8StrSink)
            QpsLineMetricsOutput(utf8StrSink.toString(), it.getLong(1))
        }

        return dateRangeDataCompletion(interval, intervalType, dateRangeMs, result) { it, unit ->
            QpsLineMetricsOutput(unit, it?.value ?: 0)
        }
    }

    /**
     * duration 折线图指标
     */
    override suspend fun durationLineMetrics(input: RouteLineMetricsInput): List<DurationLineMetricsOutput> {
        val interval = input.interval
        val intervalType = input.intervalType
        val (prefixFormat, extractFunc, truncFunc) = requireNotNull(qpsLineMetricsMap[intervalType])
        val dateRangeMs = input.getDateRangeMs()

        val result = cairoEngine.findAll(
            """
                    SELECT
                      concat(
                        to_str(trunc_time, '${prefixFormat}'),
                        CASE
                          WHEN ((${extractFunc}(trunc_time) / ${interval}) * ${interval}) >= 10 THEN ''
                          ELSE '0'
                        END,
                        (${extractFunc}(trunc_time) / ${interval}) * $interval
                      ) as unit,
                       sum(total_time) / sum(total)  as avg_value,
                       max(max_time)  as max_value
                    FROM
                      (
                        SELECT
                          date_trunc('${truncFunc}', to_timezone(request_time, '${timeZoneOffset()}')) as trunc_time,
                          count as total,
                          sum((response_time - request_time) / 1000) as total_time,
                          max((response_time - request_time) / 1000) as max_time
                        FROM
                          route_metrics_record
                        WHERE ${input.getQuestDBDateFilterFragment("request_time")}
                        GROUP BY trunc_time 
                      ) timestamp(trunc_time)
                    GROUP BY unit
                """.trimIndent()
        ) {
            val utf8StrSink = Utf8StringSink()
            it.getStr(0, utf8StrSink)
            DurationLineMetricsOutput(utf8StrSink.toString(), it.getLong(1), it.getLong(2))
        }

        return dateRangeDataCompletion(interval, intervalType, dateRangeMs, result) { it, unit ->
            DurationLineMetricsOutput(unit, it?.avgValue ?: 0, it?.maxValue ?: 0)
        }
    }

    /**
     * top qps 折线图
     */
    override suspend fun topQpsLineMetrics(input: TopRouteLineMetricsInput): List<TopQpsLineMetricsOutput> {
        val interval = input.interval
        val intervalType = input.intervalType
        val (prefixFormat, extractFunc, truncFunc) = requireNotNull(qpsLineMetricsMap[intervalType])

        val dateRangeMs = input.getDateRangeMs()

        val second = interval.toDuration(intervalType.unit).toLong(DurationUnit.SECONDS)
        val result = cairoEngine.findAll(
            """
                    SELECT
                      concat(
                        to_str(trunc_time, '${prefixFormat}'),
                        CASE
                          WHEN ((${extractFunc}(trunc_time) / ${interval}) * ${interval}) >= 10 THEN ''
                          ELSE '0'
                        END,
                        (${extractFunc}(trunc_time) / ${interval}) * $interval
                      ) as unit,
                       d.api,
                       CASE WHEN sum(d.value) % $second > 0 THEN (sum(d.value) / ${second}) + 1 
                       ELSE sum(d.value) / $second END as value
                    FROM
                      (
                        SELECT
                          date_trunc('${truncFunc}', to_timezone(request_time, '${timeZoneOffset()}')) as trunc_time,
                          concat(method, ' ', app_path) as api,
                          count as value
                        FROM
                          route_metrics_record
                        WHERE ${input.getQuestDBDateFilterFragment("request_time")}
                        GROUP BY api,trunc_time
                      ) as d timestamp(trunc_time),
                      (
                          SELECT
                            concat(method, ' ', app_path) as api,
                            count() as value
                          FROM  route_metrics_record
                          GROUP BY api
                          ORDER BY value desc
                          LIMIT ${input.top}
                        ) as t
                    WHERE t.api = d.api 
                    GROUP BY d.api, d.trunc_time;
                """.trimIndent()
        ) {
            val unitStrSink = Utf8StringSink()
            it.getStr(0, unitStrSink)
            val apiStrSink = Utf8StringSink()
            it.getStr(1, apiStrSink)
            TopQpsLineMetricsMo(unitStrSink.toString(), apiStrSink.toString(), it.getLong(2))
        }

        return result.groupBy { it.api }
            .map { entry ->
                val data =
                    dateRangeDataCompletion(interval, intervalType, dateRangeMs, entry.value) { it, unit ->
                        QpsLineMetricsOutput(unit, it?.value ?: 0)
                    }
                TopQpsLineMetricsOutput(entry.key, data)
            }
    }
}
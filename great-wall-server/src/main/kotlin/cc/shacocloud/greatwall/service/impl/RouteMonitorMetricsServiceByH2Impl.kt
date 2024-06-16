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
import cc.shacocloud.greatwall.utils.*
import cc.shacocloud.greatwall.utils.AppUtil.timeZoneOffset
import cc.shacocloud.greatwall.utils.MonitorMetricsUtils.dateRangeDataCompletion
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import io.questdb.cairo.CairoEngine
import io.questdb.std.str.Utf8StringSink
import kotlinx.datetime.format.DateTimeComponents
import kotlinx.datetime.format.DateTimeComponents.Companion.Format
import kotlinx.datetime.format.DateTimeFormat
import org.springframework.r2dbc.core.DatabaseClient
import org.springframework.r2dbc.core.await
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import kotlin.time.DurationUnit
import kotlin.time.toDuration
import io.r2dbc.spi.Readable
import kotlinx.coroutines.reactive.awaitSingle
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.runBlocking
import kotlinx.datetime.*
import org.springframework.scheduling.annotation.Scheduled

/**
 * 基于 h2 实现的 [RouteMonitorMetricsService]
 *
 * @author 思追(shaco)
 * @see [https://questdb.io/]
 */
@Slf4j
@Service
@Transactional(rollbackFor = [Exception::class])
class RouteMonitorMetricsServiceByH2Impl(
    val cairoEngine: CairoEngine,
    val databaseClient: DatabaseClient
) : RouteMonitorMetricsService {

    companion object {

        val qpsLineMetricsMap = mapOf(
            DateRangeDurationUnit.SECONDS to LineMetricsIntervalConf("yyyy-MM-dd HH:mm:", "second", "second"),
            DateRangeDurationUnit.MINUTES to LineMetricsIntervalConf("yyyy-MM-dd HH:", "minute", "minute"),
            DateRangeDurationUnit.HOURS to LineMetricsIntervalConf("yyyy-MM-dd ", "hour", "hour"),
            DateRangeDurationUnit.DAYS to LineMetricsIntervalConf("yyyy-MM-", "days_in_month", "day"),
        )
    }

    // 表名集合
    private val tableNameSet: MutableSet<String> by lazy {
        runBlocking {
            databaseClient.sql("show tables")
                .map { readable: Readable -> readable.get(0) as String }
                .all()
                .collectList()
                .awaitSingle()
                .filter { it.startsWith("route_metrics_record_") }
                .toMutableSet()
        }
    }

    /**
     * 获取表名称
     */
    suspend fun getTableName(day: String): String {
        return "route_metrics_record_${day}"
    }

    /**
     * 获取表名 如果真实存在则为 true，反正 false
     */
    suspend fun getTableNameOfExists(day: String): String? {
        val tableName = getTableName(day)
        if (tableNameSet.contains(tableName)) return tableName
        return null
    }

    /**
     * 创建指定天的表，数据按天存储写在不同的表中
     */
    suspend fun createTable(day: String): String {
        val tableName = getTableName(day)
        if (tableNameSet.contains(tableName)) return tableName

        val createTableSql: String = """
            CREATE TABLE IF NOT EXISTS $tableName
            (
                id                 BIGINT PRIMARY KEY AUTO_INCREMENT,
                ip                 VARCHAR(45)  NOT NULL,
                method             VARCHAR(20)  NOT NULL,
                endpoint           VARCHAR(255) NOT NULL,
                request_time       BIGINT       NOT NULL,
                handle_time        BIGINT       NOT NULL,
                status_code        INT          NOT NULL,
                request_body_size  BIGINT       NOT NULL,
                response_body_size BIGINT       NOT NULL,
                request_count      INT          NOT NULL,
                constraint uk_${tableName.replace("_", "")} unique (request_time, status_code, ip, method, endpoint)
            )
        """.trimIndent()
        databaseClient.sql(createTableSql).await()

        // 添加表
        tableNameSet.add(tableName)

        return tableName
    }


    /**
     * 添加请求指标记录
     */
    override suspend fun addRouteRecord(record: RouteMetricsRecordPo) {
        try {
            val requestTime = record.requestTime
            val requestLocalDateTime = requestTime.toLocalDateTime(TimeZone.currentSystemDefault())

            val day = requestLocalDateTime.format(DATE_TIME_DAY_NO_SEP_FORMAT)
            val tableName = createTable(day)

            // 计算部分数据
            val handleTime = (record.responseTime - requestTime).toLong(DurationUnit.MILLISECONDS)
            val requestSecondTime = requestLocalDateTime.toInstant(TimeZone.currentSystemDefault()).epochSeconds

            databaseClient.sql(
                """
                    MERGE INTO $tableName t
                    USING (
                        SELECT '${record.ip}' AS ip, '${record.method}' AS method, '${record.endpoint}' AS endpoint, 
                        $requestSecondTime AS request_time, $handleTime AS handle_time, ${record.statusCode} AS status_code,
                        ${record.requestBodySize} AS request_body_size, ${record.responseBodySize} AS response_body_size
                    ) s
                    ON (
                        t.request_time = s.request_time AND t.status_code = s.status_code AND t.ip = s.ip
                        AND t.method = s.method AND t.endpoint = s.endpoint
                    )
                    WHEN MATCHED THEN
                        UPDATE SET t.handle_time = s.handle_time + t.handle_time, 
                        t.request_body_size = t.request_body_size + s.request_body_size,
                        t.response_body_size = t.response_body_size + s.response_body_size, 
                        t.request_count = t.request_count + 1
                    WHEN NOT MATCHED THEN
                        INSERT (
                            ip, method, endpoint, request_time, handle_time, status_code, 
                            request_body_size, response_body_size, request_count 
                        ) 
                        VALUES (
                            s.ip, s.method, s.endpoint, s.request_time, s.handle_time, s.status_code, s.request_body_size, 
                            s.response_body_size, 1
                        )
            """.trimIndent()
            )
                .await()
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
        return input.countMetrics { tableName, requestTimeFragment ->
            "SELECT sum(request_count) FROM $tableName WHERE $requestTimeFragment"
        }
    }

    /**
     * ip 统计指标
     */
    override suspend fun ipCountMetrics(input: RouteCountMetricsInput): ValueMetricsOutput {
        return input.countMetrics { tableName, requestTimeFragment ->
            "SELECT count(distinct ip) FROM $tableName WHERE $requestTimeFragment"
        }
    }

    /**
     * 请求流量指标
     */
    override suspend fun requestTrafficSumMetrics(input: RouteCountMetricsInput): ValueMetricsOutput {
        return input.countMetrics { tableName, requestTimeFragment ->
            "SELECT sum(request_body_size) FROM $tableName WHERE $requestTimeFragment"
        }
    }

    /**
     * 响应流量指标
     */
    override suspend fun responseTrafficSumMetrics(input: RouteCountMetricsInput): ValueMetricsOutput {
        return input.countMetrics { tableName, requestTimeFragment ->
            "SELECT sum(response_body_size) FROM $tableName WHERE $requestTimeFragment"
        }
    }

    /**
     * 状态码 4xx 统计指标
     */
    override suspend fun status4xxCountMetrics(input: RouteCountMetricsInput): ValueMetricsOutput {
        return input.countMetrics { tableName, requestTimeFragment ->
            "SELECT sum(request_count) FROM $tableName WHERE $requestTimeFragment AND status_code >= 400 AND status_code < 500"
        }
    }

    /**
     * 状态码 5xx 统计指标
     */
    override suspend fun status5xxCountMetrics(input: RouteCountMetricsInput): ValueMetricsOutput {
        return input.countMetrics { tableName, requestTimeFragment ->
            "SELECT sum(request_count) FROM $tableName WHERE $requestTimeFragment AND status_code >= 500"
        }
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


    /**
     * 统计指标
     */
    suspend fun RouteCountMetricsInput.countMetrics(
        sqlProvider: (tableName: String, requestTimeFragment: String) -> String
    ): ValueMetricsOutput {
        val dateRangeMs = getDateRangeMs()
        val (form, to) = dateRangeMs

        val value = (0..dateRangeMs.diffDay()).sumOf {
            val day = (form + it.toDuration(DurationUnit.DAYS)).format(DATE_TIME_DAY_NO_SEP_COMPONENTS_FORMAT)

            val count = getTableNameOfExists(day)?.let { tableName ->
                val fragment = "request_time between ${form.epochSeconds} and ${to.epochSeconds}"
                databaseClient.sql(sqlProvider(tableName, fragment))
                    .map { readable: Readable -> (readable.get(0) as Number?)?.toLong() ?: 0 }
                    .one()
                    .awaitSingle()
            }

            count ?: 0
        }

        return ValueMetricsOutput(value)
    }
}
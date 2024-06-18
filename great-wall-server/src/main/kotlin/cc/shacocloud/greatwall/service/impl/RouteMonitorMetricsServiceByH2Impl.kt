package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.model.dto.input.RouteCountMetricsInput
import cc.shacocloud.greatwall.model.dto.input.RouteLineMetricsInput
import cc.shacocloud.greatwall.model.dto.input.TopRouteLineMetricsInput
import cc.shacocloud.greatwall.model.dto.output.*
import cc.shacocloud.greatwall.model.mo.TopQpsLineMetricsMo
import cc.shacocloud.greatwall.model.po.RouteMetricsRecordPo
import cc.shacocloud.greatwall.service.RouteMonitorMetricsService
import cc.shacocloud.greatwall.utils.*
import cc.shacocloud.greatwall.utils.MonitorMetricsUtils.dateRangeDataCompletion
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import io.r2dbc.spi.Readable
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.runBlocking
import org.springframework.r2dbc.core.DatabaseClient
import org.springframework.r2dbc.core.await
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit

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
    val databaseClient: DatabaseClient,
) : RouteMonitorMetricsService {

    // 表名集合
    private val tableNameSet: MutableSet<String> = mutableSetOf()

    init {
        val tableNames = runBlocking {
            getAllRouteMonitorMetricsTables()
        }
        tableNameSet.addAll(tableNames)
    }

    /**
     * 删除30天之前的表信息
     */
    @Scheduled(cron = "1 0 0 * * *")
    suspend fun deleteExpirationTables() {
        val current = LocalDateTime.now() - 30.days
        val needDelTables = getAllRouteMonitorMetricsTables()
            .filter {
                val day = it.removePrefix("route_metrics_record_")
                val dayDateTime = LocalDateTime.parse(day, DATE_TIME_DAY_FORMAT)
                dayDateTime < current
            }

        for (table in needDelTables) {
            databaseClient.sql("drop table if exists $table")
                .await()
        }

        tableNameSet.clear()
        tableNameSet.addAll(getAllRouteMonitorMetricsTables())
    }

    /**
     * 获取所有路由指标记录表
     */
    suspend fun getAllRouteMonitorMetricsTables(): MutableSet<String> {
        return databaseClient.sql("show tables")
            .map { readable: Readable -> readable.get(0) as String }
            .all()
            .collectList()
            .awaitSingle()
            .map { it.lowercase() }
            .filter { it.startsWith("route_metrics_record_") }
            .toMutableSet()
    }

    /**
     * 获取表名称
     * @param day [DATE_TIME_DAY_NO_SEP_FORMAT]
     */
    suspend fun getTableName(day: String): String {
        return "route_metrics_record_${day}"
    }

    /**
     * 获取表名 如果真实存在则为 true，反正 false
     * @param day [DATE_TIME_DAY_NO_SEP_FORMAT]
     */
    suspend fun getTableNameOfExists(day: String): String? {
        val tableName = getTableName(day)
        if (tableNameSet.contains(tableName)) return tableName
        return null
    }

    /**
     * 创建指定天的表，数据按天存储写在不同的表中
     * @param day [DATE_TIME_DAY_NO_SEP_FORMAT]
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
                max_time           INT          NOT NULL,
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
            val day = requestTime.toLocalDateTime().format(DATE_TIME_DAY_NO_SEP_FORMAT)
            val tableName = createTable(day)

            // 计算部分数据
            val handleTime = record.handleTime
            val requestSecondTime = requestTime.toLocalDateTime().toEpochSecond()

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
                        t.request_count = t.request_count + 1,
                        t.max_time = GREATEST(t.max_time, s.handle_time)
                    WHEN NOT MATCHED THEN
                        INSERT (
                            ip, method, endpoint, request_time, handle_time, status_code, 
                            request_body_size, response_body_size, request_count, max_time
                        ) 
                        VALUES (
                            s.ip, s.method, s.endpoint, s.request_time, s.handle_time, s.status_code, s.request_body_size, 
                            s.response_body_size, 1, s.handle_time
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
        return countMetrics(input) { tableName, requestTimeFragment ->
            "SELECT sum(request_count) FROM $tableName WHERE $requestTimeFragment"
        }
    }

    /**
     * ip 统计指标
     */
    override suspend fun ipCountMetrics(input: RouteCountMetricsInput): ValueMetricsOutput {
        return countMetrics(input) { tableName, requestTimeFragment ->
            "SELECT count(distinct ip) FROM $tableName WHERE $requestTimeFragment"
        }
    }

    /**
     * 请求流量指标
     */
    override suspend fun requestTrafficSumMetrics(input: RouteCountMetricsInput): ValueMetricsOutput {
        return countMetrics(input) { tableName, requestTimeFragment ->
            "SELECT sum(request_body_size) FROM $tableName WHERE $requestTimeFragment"
        }
    }

    /**
     * 响应流量指标
     */
    override suspend fun responseTrafficSumMetrics(input: RouteCountMetricsInput): ValueMetricsOutput {
        return countMetrics(input) { tableName, requestTimeFragment ->
            "SELECT sum(response_body_size) FROM $tableName WHERE $requestTimeFragment"
        }
    }

    /**
     * 状态码 4xx 统计指标
     */
    override suspend fun status4xxCountMetrics(input: RouteCountMetricsInput): ValueMetricsOutput {
        return countMetrics(input) { tableName, requestTimeFragment ->
            "SELECT sum(request_count) FROM $tableName WHERE $requestTimeFragment AND status_code >= 400 AND status_code < 500"
        }
    }

    /**
     * 状态码 5xx 统计指标
     */
    override suspend fun status5xxCountMetrics(input: RouteCountMetricsInput): ValueMetricsOutput {
        return countMetrics(input) { tableName, requestTimeFragment ->
            "SELECT sum(request_count) FROM $tableName WHERE $requestTimeFragment AND status_code >= 500"
        }
    }

    /**
     * qps 折线图指标
     */
    override suspend fun qpsLineMetrics(input: RouteLineMetricsInput): List<QpsLineMetricsOutput> {

        // 查询的sql
        val sqlProvider: (LineMetricsInfo) -> String =
            { info ->
                val (tableName, requestTimeFragment, second, _, furtherUnitSecond) = info
                """
                    select (request_time - (request_time % $furtherUnitSecond)) + ((request_time % $furtherUnitSecond) / $second * $second) as time,
                           sum(request_count)                                                                                       as val
                    from $tableName
                    where $requestTimeFragment
                    group by time
                """.trimIndent()
            }

        // 结果封装
        val resultExtract: (Readable, LineMetricsInfo) -> QpsLineMetricsOutput = { readable, _ ->
            val unit = (readable.get(0) as Number).toLong().toLocalDateTimeByEpochSecond()
                .format(input.rawIntervalType.format)
            val value = (readable.get(1) as Number).toLong()
            QpsLineMetricsOutput(unit, value)
        }

        // 查询指标
        val result = lineMetrics(input, sqlProvider, resultExtract)

        // 数据补全
        return dateRangeDataCompletion(input, result) { it, unit ->
            QpsLineMetricsOutput(unit, it?.value ?: 0)
        }
    }

    /**
     * duration 折线图指标
     */
    override suspend fun durationLineMetrics(input: RouteLineMetricsInput): List<DurationLineMetricsOutput> {
        // 查询的sql
        val sqlProvider: (LineMetricsInfo) -> String =
            { info ->
                val (tableName, requestTimeFragment, second, _, furtherUnitSecond) = info
                """
                    select (request_time - (request_time % $furtherUnitSecond)) + ((request_time % $furtherUnitSecond) / $second * $second) as time,
                           ROUND(sum(handle_time) / sum(request_count), 2) as val,
                           max(max_time) as max_time
                    from $tableName
                    where $requestTimeFragment
                    group by time
                """.trimIndent()
            }

        // 结果封装
        val resultExtract: (Readable, LineMetricsInfo) -> DurationLineMetricsOutput = { readable, _ ->
            val unit = (readable.get(0) as Number).toLong().toLocalDateTimeByEpochSecond()
                .format(input.rawIntervalType.format)
            val avgValue = (readable.get(1) as Number).toDouble()
            val maxValue = (readable.get(2) as Number).toLong()
            DurationLineMetricsOutput(unit, avgValue, maxValue)
        }

        // 查询指标
        val result = lineMetrics(input, sqlProvider, resultExtract)

        // 数据补全
        return dateRangeDataCompletion(input, result) { it, unit ->
            DurationLineMetricsOutput(unit, it?.avgValue ?: 0.toDouble(), it?.maxValue ?: 0)
        }
    }

    /**
     * top qps 折线图
     */
    override suspend fun topQpsLineMetrics(input: TopRouteLineMetricsInput): List<TopQpsLineMetricsOutput> {
        // 查询的sql
        val sqlProvider: (LineMetricsInfo) -> String =
            { info ->
                val (tableName, requestTimeFragment, second, _, furtherUnitSecond) = info
                """
                    select (request_time - (request_time % $furtherUnitSecond)) + ((request_time % $furtherUnitSecond) / $second * $second) as time,
                           endpoint,
                           sum(request_count)  as val
                    from $tableName
                    where $requestTimeFragment
                    group by time, endpoint
                    order by val desc
                    limit ${input.top}
                """.trimIndent()
            }

        // 结果封装
        val resultExtract: (Readable, LineMetricsInfo) -> TopQpsLineMetricsMo = { readable, _ ->
            val unit = (readable.get(0) as Number).toLong().toLocalDateTimeByEpochSecond()
                .format(input.rawIntervalType.format)
            val endpoint = readable.get(1).toString()
            val value = (readable.get(2) as Number).toLong()
            TopQpsLineMetricsMo(unit, endpoint, value)
        }

        // 查询指标
        val result = lineMetrics(input, sqlProvider, resultExtract)

        // 数据补全
        return result.groupBy { it.endpoint }
            .map { entry ->
                val data =
                    dateRangeDataCompletion(input, entry.value) { it, unit ->
                        QpsLineMetricsOutput(unit, it?.value ?: 0)
                    }
                TopQpsLineMetricsOutput(entry.key, data)
            }
    }


    /**
     * 统计指标
     */
    suspend fun countMetrics(
        input: RouteCountMetricsInput,
        sqlProvider: (tableName: String, requestTimeFragment: String) -> String
    ): ValueMetricsOutput {
        val dateRangeMs = input.getDateRange()
        val (form, to) = dateRangeMs

        val value = (0..dateRangeMs.diffDays()).sumOf {
            val day = (form + it.toDuration(ChronoUnit.DAYS))
                .format(DATE_TIME_DAY_NO_SEP_FORMAT)

            val count = getTableNameOfExists(day)?.let { tableName ->
                val fragment = "request_time between ${form.toEpochSecond()} and ${to.toEpochSecond()}"
                databaseClient.sql(sqlProvider(tableName, fragment))
                    .map { readable: Readable -> (readable.get(0) as Number?)?.toLong() ?: 0 }
                    .one()
                    .awaitSingle()
            }

            count ?: 0
        }

        return ValueMetricsOutput(value)
    }


    /**
     * 折线图指标指标
     */
    suspend fun <T : LineMetricsOutput> lineMetrics(
        input: RouteLineMetricsInput,
        sqlProvider: (LineMetricsInfo) -> String,
        resultExtract: (Readable, LineMetricsInfo) -> T
    ): List<T> {
        val dateRangeMs = input.getDateRange()
        val (form, to) = dateRangeMs

        val second = input.getIntervalSecond()

        // 获取比间隔时间单位大一个的单位
        val furtherUnit = input.getFurtherUnit()
        val furtherUnitSecond = 1.toDuration(furtherUnit.unit).toSeconds()

        return (0..dateRangeMs.diffDays()).flatMap {
            val day = (form + it.toDuration(ChronoUnit.DAYS))
                .format(DATE_TIME_DAY_NO_SEP_FORMAT)

            getTableNameOfExists(day)?.let { tableName ->
                val fragment = "request_time between ${form.toEpochSecond()} and ${to.toEpochSecond()}"
                val info = LineMetricsInfo(tableName, fragment, second, furtherUnit, furtherUnitSecond)
                databaseClient.sql(sqlProvider(info))
                    .map { readable: Readable -> resultExtract(readable, info) }
                    .all()
                    .collectList()
                    .awaitSingle()
            } ?: emptyList()
        }
    }

    data class LineMetricsInfo(
        val tableName: String,
        val requestTimeFragment: String,
        val second: Long,
        val furtherUnit: DateRangeDurationUnit,
        val furtherUnitSecond: Long
    )
}

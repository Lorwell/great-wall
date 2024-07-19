package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.config.R2dbcConfiguration.Companion.bindByName
import cc.shacocloud.greatwall.model.dto.input.LineMetricsInput
import cc.shacocloud.greatwall.model.dto.output.*
import cc.shacocloud.greatwall.model.mo.GcLineMetricsMo
import cc.shacocloud.greatwall.model.po.SystemMetricsRecordPo
import cc.shacocloud.greatwall.service.SystemMonitorMetricsService
import cc.shacocloud.greatwall.service.scheduled.SystemMetricsScheduled.Companion.lessThanZeroLet
import cc.shacocloud.greatwall.utils.*
import cc.shacocloud.greatwall.utils.MonitorMetricsUtils.dateRangeDataCompletion
import cc.shacocloud.greatwall.utils.MonitorMetricsUtils.lineMetricsDateRangeDataCompletion
import io.r2dbc.spi.Readable
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.mono
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.r2dbc.core.DatabaseClient
import org.springframework.r2dbc.core.await
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.temporal.ChronoUnit
import java.util.concurrent.ConcurrentHashMap

/**
 *
 * @author 思追(shaco)
 */
@Service
@Transactional(rollbackFor = [Exception::class])
class SystemMonitorMetricsServiceByH2Impl(
    val databaseClient: DatabaseClient,
) : SystemMonitorMetricsService {

    companion object {
        private val log: Logger = LoggerFactory.getLogger(SystemMonitorMetricsServiceByH2Impl::class.java)

        const val TABLE_NAME_PREFIX = "system_metrics_record_"
        const val GC_TABLE_NAME_PREFIX = "system_gc_metrics_record_"
    }

    // 表名集合
    private var tableNameSet: MutableSet<String> = mutableSetOf()
    private var gcTableNameSet: MutableSet<String> = mutableSetOf()

    // gc 类型名称集合
    private var gcTypeNameMap: MutableMap<String, Int> = ConcurrentHashMap()

    @EventListener(ApplicationReadyEvent::class)
    fun appReady() = mono {
        val tableNames = getAllSystemMonitorMetricsTables()
        tableNameSet.addAll(tableNames)

        val gcTableNames = getAllSystemGcMonitorMetricsTables()
        gcTableNameSet.addAll(gcTableNames)

        gcTypeNameMap.putAll(getSystemGcTypeMap())
    }

    /**
     * 删除30天之前的表信息
     */
    @Scheduled(cron = "1 0 0 * * *")
    fun deleteExpirationTables() = mono {
        val current = LocalDateTime.now() - 30.days
        val needDelTables = getAllSystemMonitorMetricsTables()
            .filter {
                val day = it.removePrefix(TABLE_NAME_PREFIX)
                val dayDateTime = LocalDate.parse(day, DATE_TIME_DAY_NO_SEP_FORMAT).atStartOfDay()
                dayDateTime < current
            }
        for (table in needDelTables) {
            databaseClient.sql("drop table if exists $table")
                .await()
        }

        val needDelGcTables = getAllSystemGcMonitorMetricsTables()
            .filter {
                val day = it.removePrefix(GC_TABLE_NAME_PREFIX)
                val dayDateTime = LocalDate.parse(day, DATE_TIME_DAY_NO_SEP_FORMAT).atStartOfDay()
                dayDateTime < current
            }
        for (table in needDelGcTables) {
            databaseClient.sql("drop table if exists $table")
                .await()
        }

        tableNameSet = getAllSystemMonitorMetricsTables()
        gcTableNameSet = getAllSystemGcMonitorMetricsTables()
    }

    /**
     * 获取系统gc类型映射
     */
    suspend fun getSystemGcTypeMap(): Map<String, Int> {
        return databaseClient.sql("select id, type_name from system_gc_type")
            .map { readable: Readable ->
                val id = (readable.get(0) as Number).toInt()
                val typeName = (readable.get(1) as CharSequence).toString()
                typeName to id
            }
            .all()
            .collectList()
            .awaitSingle()
            .toMap()
    }

    /**
     * 获取所有系统指标记录表
     */
    suspend fun getAllSystemMonitorMetricsTables(): MutableSet<String> {
        return databaseClient.sql("show tables")
            .map { readable: Readable -> readable.get(0) as String }
            .all()
            .collectList()
            .awaitSingle()
            .map { it.lowercase() }
            .filter { it.startsWith(TABLE_NAME_PREFIX) }
            .toMutableSet()
    }

    /**
     * 获取所有系统指标记录表
     */
    suspend fun getAllSystemGcMonitorMetricsTables(): MutableSet<String> {
        return databaseClient.sql("show tables")
            .map { readable: Readable -> readable.get(0) as String }
            .all()
            .collectList()
            .awaitSingle()
            .map { it.lowercase() }
            .filter { it.startsWith(GC_TABLE_NAME_PREFIX) }
            .toMutableSet()
    }


    /**
     * 获取表名称
     * @param day [DATE_TIME_DAY_NO_SEP_FORMAT]
     */
    suspend fun getTableName(day: String): String {
        return "${TABLE_NAME_PREFIX}${day}"
    }

    /**
     * 获取表名称
     * @param day [DATE_TIME_DAY_NO_SEP_FORMAT]
     */
    suspend fun getGcTableName(day: String): String {
        return "${GC_TABLE_NAME_PREFIX}${day}"
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
     * 获取表名 如果真实存在则为 true，反正 false
     * @param day [DATE_TIME_DAY_NO_SEP_FORMAT]
     */
    suspend fun getGcTableNameOfExists(day: String): String? {
        val tableName = getGcTableName(day)
        if (gcTableNameSet.contains(tableName)) return tableName
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
                id                         BIGINT PRIMARY KEY AUTO_INCREMENT,
                second_unit                BIGINT        NOT NULL unique,
                heap_memory_use            BIGINT        NOT NULL,
                heap_memory_committed      BIGINT        NOT NULL,
                heap_memory_max            BIGINT        NULL,
                non_heap_memory_use        BIGINT        NOT NULL,
                non_heap_memory_committed  BIGINT        NOT NULL,
                non_heap_memory_max        BIGINT        NULL,
                cpu_load                   decimal(3, 2) NOT NULL,
                process_cpu_load           decimal(3, 2) NOT NULL,
                thread_total               INT           NOT NULL,
                thread_new_count           INT           NOT NULL,
                thread_runnable_count      INT           NOT NULL,
                thread_blocked_count       INT           NOT NULL,
                thread_waiting_count       INT           NOT NULL,
                thread_timed_waiting_count INT           NOT NULL,
                thread_terminated_count    INT           NOT NULL,
                loaded_class_count         INT           NOT NULL,
                loaded_class_total         BIGINT        NOT NULL,
                unloaded_classes           BIGINT        NOT NULL,
                direct_memory_use          BIGINT        NULL,
                direct_memory_committed    BIGINT        NULL,
                direct_memory_max          BIGINT        NULL
            )
        """.trimIndent()
        databaseClient.sql(createTableSql).await()

        // 添加表
        tableNameSet.add(tableName)

        return tableName
    }

    /**
     * 创建指定天的表，数据按天存储写在不同的表中
     * @param day [DATE_TIME_DAY_NO_SEP_FORMAT]
     */
    suspend fun createGcTable(day: String): String {
        val tableName = getGcTableName(day)
        if (gcTableNameSet.contains(tableName)) return tableName

        val createTableSql: String = """
            CREATE TABLE IF NOT EXISTS $tableName
            (
                id          BIGINT PRIMARY KEY AUTO_INCREMENT,
                second_unit BIGINT NOT NULL,
                type_id     INT    NOT NULL,
                count       BIGINT NOT NULL,
                time        BIGINT NOT NULL,
                constraint uk_${tableName.lowercase()} unique (second_unit, type_id)
            )
        """.trimIndent()
        databaseClient.sql(createTableSql).await()

        // 添加表
        gcTableNameSet.add(tableName)

        return tableName
    }

    /**
     * 获取gc类型对应的id
     */
    suspend fun getGcTypeId(name: String): Int {
        var typeId = gcTypeNameMap[name]

        if (typeId == null) {
            databaseClient.sql(
                """
                MERGE INTO system_gc_type t
                    USING (SELECT '${name}' AS type_name) s
                ON (t.type_name = s.type_name)
                WHEN MATCHED THEN
                    UPDATE
                    SET t.type_name = t.type_name
                WHEN NOT MATCHED THEN
                    INSERT (type_name)
                    VALUES (s.type_name);
            """.trimIndent()
            )
                .await()

            typeId = databaseClient.sql("select id from system_gc_type where type_name = :typeName")
                .bindByName("typeName", name)
                .map { readable: Readable -> (readable.get(0) as Number).toInt() }
                .one()
                .awaitSingle()

            gcTypeNameMap[name] = typeId
        }

        return typeId!!
    }

    override suspend fun addRouteRecord(record: SystemMetricsRecordPo) {
        val day = record.timeUnit.format(DATE_TIME_DAY_NO_SEP_FORMAT)
        val tableName = createTable(day)
        val gcTableName = createGcTable(day)

        databaseClient.sql(
            """
            insert into ${tableName}(second_unit, heap_memory_use, heap_memory_committed, heap_memory_max, non_heap_memory_use, 
            non_heap_memory_committed, non_heap_memory_max, cpu_load, process_cpu_load, thread_total, thread_new_count, 
            thread_runnable_count, thread_blocked_count, thread_waiting_count, thread_timed_waiting_count, 
            thread_terminated_count, loaded_class_count, loaded_class_total, unloaded_classes, direct_memory_use, 
            direct_memory_committed, direct_memory_max)
           values (:secondUnit, :heapMemoryUse,:heapMemoryCommitted, :heapMemoryMax, :nonHeapMemoryUse, 
                   :nonHeapMemoryCommitted,  :nonHeapMemoryMax, :cpuLoad, :processCpuLoad, :threadTotal, :threadNewCount, 
                   :threadRunnableCount, :threadBlockedCount, :threadWaitingCount, :threadTimedWaitingCount, 
                   :threadTerminatedCount, :loadedClassCount, :loadedClassTotal, :unloadedClasses, :directMemoryUse, 
                   :directMemoryCommitted, :directMemoryMax)
        """.trimIndent()
        )
            .bindByName("secondUnit", record.timeUnit.toEpochSecond())
            .bindByName("heapMemoryUse", record.heapMemoryUse)
            .bindByName("heapMemoryCommitted", record.heapMemoryCommitted)
            .bindByName("heapMemoryMax", record.heapMemoryMax)
            .bindByName("nonHeapMemoryUse", record.nonHeapMemoryUse)
            .bindByName("nonHeapMemoryCommitted", record.nonHeapMemoryCommitted)
            .bindByName("nonHeapMemoryMax", record.nonHeapMemoryMax)
            .bindByName("cpuLoad", record.cpuLoad)
            .bindByName("processCpuLoad", record.processCpuLoad)
            .bindByName("threadTotal", record.threadTotal)
            .bindByName("threadNewCount", record.threadNewCount)
            .bindByName("threadRunnableCount", record.threadRunnableCount)
            .bindByName("threadBlockedCount", record.threadBlockedCount)
            .bindByName("threadWaitingCount", record.threadWaitingCount)
            .bindByName("threadTimedWaitingCount", record.threadTimedWaitingCount)
            .bindByName("threadTerminatedCount", record.threadTerminatedCount)
            .bindByName("loadedClassTotal", record.loadedClassTotal)
            .bindByName("loadedClassCount", record.loadedClassCount)
            .bindByName("unloadedClasses", record.unloadedClasses)
            .bindByName("directMemoryUse", record.directMemoryUse)
            .bindByName("directMemoryCommitted", record.directMemoryCommitted)
            .bindByName("directMemoryMax", record.directMemoryMax)
            .await()

        for (gcInfo in record.gcInfos) {
            val typeId = getGcTypeId(gcInfo.name)
            databaseClient.sql(
                """
                   insert into ${gcTableName}(second_unit, type_id, count, time)
                   values (:secondUnit, :typeId, :count, :time)
                """.trimIndent()
            )
                .bindByName("secondUnit", record.timeUnit.toEpochSecond())
                .bindByName("typeId", typeId)
                .bindByName("count", gcInfo.count)
                .bindByName("time", gcInfo.time)
                .await()
        }
    }

    override suspend fun headMemoryLineMetrics(input: LineMetricsInput): List<MemoryLineMetricsOutput> {
        return memoryLineMetrics(input) { (tableName, requestTimeFragment, second, furtherUnitSecond) ->
            """
                    select (second_unit - (second_unit % $furtherUnitSecond)) + ((second_unit % $furtherUnitSecond) / $second * $second) as time,
                           round(sum(heap_memory_use) / count(heap_memory_use), 0) as use,
                           round(sum(heap_memory_committed) / count(heap_memory_committed), 0) as committed,
                           round(sum(heap_memory_max) / count(heap_memory_max), 0) as max
                    from $tableName
                    where ${requestTimeFragment.get()}
                    group by time
                """.trimIndent()
        }
    }

    override suspend fun nonHeadMemoryLineMetrics(input: LineMetricsInput): List<MemoryLineMetricsOutput> {
        return memoryLineMetrics(input) { (tableName, requestTimeFragment, second, furtherUnitSecond) ->
            """
                    select (second_unit - (second_unit % $furtherUnitSecond)) + ((second_unit % $furtherUnitSecond) / $second * $second) as time,
                           round(sum(non_heap_memory_use) / count(non_heap_memory_use), 0) as use,
                           round(sum(non_heap_memory_committed) / count(non_heap_memory_committed), 0) as committed,
                           round(sum(non_heap_memory_max) / count(non_heap_memory_max), 0) as max
                    from $tableName
                    where ${requestTimeFragment.get()}
                    group by time
                """.trimIndent()
        }
    }

    override suspend fun directMemoryLineMetrics(input: LineMetricsInput): List<MemoryLineMetricsOutput> {
        return memoryLineMetrics(input) { (tableName, requestTimeFragment, second, furtherUnitSecond) ->
            """
                    select (second_unit - (second_unit % $furtherUnitSecond)) + ((second_unit % $furtherUnitSecond) / $second * $second) as time,
                           round(sum(direct_memory_use) / count(direct_memory_use), 0) as use,
                           round(sum(direct_memory_committed) / count(direct_memory_committed), 0) as committed,
                           round(sum(direct_memory_max) / count(direct_memory_max), 0) as max
                    from $tableName
                    where ${requestTimeFragment.get()}
                    group by time
                """.trimIndent()
        }
    }

    override suspend fun cpuLineMetrics(input: LineMetricsInput): List<CpuLineMetricsOutput> {
        val sqlProvider: (LineMetricsInfo) -> String = { (tableName, requestTimeFragment, second, furtherUnitSecond) ->
            """
                    select (second_unit - (second_unit % $furtherUnitSecond)) + ((second_unit % $furtherUnitSecond) / $second * $second) as time,
                           round(sum(cpu_load) / count(cpu_load), 2) as cpuLoad,
                           round(sum(process_cpu_load) / count(process_cpu_load), 2) as processCpuLoad
                    from $tableName
                    where ${requestTimeFragment.get()}
                    group by time
                """.trimIndent()
        }

        // 结果封装
        val resultExtract: (Readable, LineMetricsInfo) -> CpuLineMetricsOutput = { readable, _ ->
            val unit = (readable.get(0) as Number).toLong().toLocalDateTimeByEpochSecond()
                .format(input.rawIntervalType.format)
            val cpuLoad = (readable.get(1) as Number).toDouble()
            val processCpuLoad = (readable.get(2) as Number).toDouble()
            CpuLineMetricsOutput(
                unit = unit,
                cpuLoad = cpuLoad,
                processCpuLoad = processCpuLoad,
            )
        }

        // 查询指标
        val result = lineMetrics(input, sqlProvider, resultExtract)

        // 数据补全
        return lineMetricsDateRangeDataCompletion(input, result) { it, unit ->
            CpuLineMetricsOutput(
                unit = unit,
                cpuLoad = it?.cpuLoad,
                processCpuLoad = it?.processCpuLoad,
            )
        }
    }

    override suspend fun threadLineMetrics(input: LineMetricsInput): List<ThreadLineMetricsOutput> {
        val sqlProvider: (LineMetricsInfo) -> String = { (tableName, requestTimeFragment, second, furtherUnitSecond) ->
            """
                    select (second_unit - (second_unit % $furtherUnitSecond)) + ((second_unit % $furtherUnitSecond) / $second * $second) as time,
                           round(sum(thread_new_count) / count(thread_new_count), 0) as new,
                           round(sum(thread_runnable_count) / count(thread_runnable_count), 0) as runnable,
                           round(sum(thread_blocked_count) / count(thread_blocked_count), 0) as blocked,
                           round(sum(thread_waiting_count) / count(thread_waiting_count), 0) as waiting,
                           round(sum(thread_timed_waiting_count) / count(thread_timed_waiting_count), 0) as timedWaiting,
                           round(sum(thread_terminated_count) / count(thread_terminated_count), 0) as terminated
                    from $tableName
                    where ${requestTimeFragment.get()}
                    group by time
                """.trimIndent()
        }

        // 结果封装
        val resultExtract: (Readable, LineMetricsInfo) -> ThreadLineMetricsOutput = { readable, _ ->
            val unit = (readable.get(0) as Number).toLong().toLocalDateTimeByEpochSecond()
                .format(input.rawIntervalType.format)
            val new = (readable.get(1) as Number).toInt()
            val runnable = (readable.get(2) as Number).toInt()
            val blocked = (readable.get(3) as Number).toInt()
            val waiting = (readable.get(4) as Number).toInt()
            val timedWaiting = (readable.get(5) as Number).toInt()
            val terminated = (readable.get(6) as Number).toInt()

            ThreadLineMetricsOutput(
                unit = unit,
                new = new,
                runnable = runnable,
                blocked = blocked,
                waiting = waiting,
                timedWaiting = timedWaiting,
                terminated = terminated,
            )
        }

        // 查询指标
        val result = lineMetrics(input, sqlProvider, resultExtract)

        // 数据补全
        return lineMetricsDateRangeDataCompletion(input, result) { it, unit ->
            ThreadLineMetricsOutput(
                unit = unit,
                new = it?.new,
                runnable = it?.runnable,
                blocked = it?.blocked,
                waiting = it?.waiting,
                timedWaiting = it?.timedWaiting,
                terminated = it?.terminated
            )
        }
    }

    override suspend fun loadedClassLineMetrics(input: LineMetricsInput): List<LoadedClassLineMetricsOutput> {
        val sqlProvider: (LineMetricsInfo) -> String = { (tableName, requestTimeFragment, second, furtherUnitSecond) ->
            """
                    select (second_unit - (second_unit % $furtherUnitSecond)) + ((second_unit % $furtherUnitSecond) / $second * $second) as time,
                           round(sum(loaded_class_total) / count(loaded_class_total), 0) as total,
                           round(sum(loaded_class_count) / count(loaded_class_count), 0) as count,
                           round(sum(unloaded_classes) / count(unloaded_classes), 0) as unloaded
                    from $tableName
                    where ${requestTimeFragment.get()}
                    group by time
                """.trimIndent()
        }

        // 结果封装
        val resultExtract: (Readable, LineMetricsInfo) -> LoadedClassLineMetricsOutput = { readable, _ ->
            val unit = (readable.get(0) as Number).toLong().toLocalDateTimeByEpochSecond()
                .format(input.rawIntervalType.format)
            val total = (readable.get(1) as Number).toLong()
            val count = (readable.get(2) as Number).toInt()
            val unloaded = (readable.get(3) as Number).toLong()

            LoadedClassLineMetricsOutput(
                unit = unit,
                total = total,
                count = count,
                unloaded = unloaded
            )
        }

        // 查询指标
        val result = lineMetrics(input, sqlProvider, resultExtract)

        // 数据补全
        return lineMetricsDateRangeDataCompletion(input, result) { it, unit ->
            LoadedClassLineMetricsOutput(
                unit = unit,
                total = it?.total,
                count = it?.count,
                unloaded = it?.unloaded
            )
        }
    }

    override suspend fun gcCountLineMetrics(input: LineMetricsInput): GcLineMetricsOutput {
        return gcLineMetrics(input) { (tableName, requestTimeFragment, second, furtherUnitSecond) ->
            """
                    select 
                        (second_unit - (second_unit % $furtherUnitSecond)) + ((second_unit % $furtherUnitSecond) / $second * $second) as time_unit,
                         type_id,
                         sum(count)
                    from $tableName
                    where ${requestTimeFragment.get()}
                    group by time_unit, type_id
                """.trimIndent()
        }
    }

    override suspend fun gcTimeLineMetrics(input: LineMetricsInput): GcLineMetricsOutput {
        return gcLineMetrics(input) { (tableName, requestTimeFragment, second, furtherUnitSecond) ->
            """
                    select
                        (second_unit - (second_unit % $furtherUnitSecond)) + ((second_unit % $furtherUnitSecond) / $second * $second) as time_unit,
                         type_id,
                         sum(time)
                    from $tableName
                    where ${requestTimeFragment.get()}
                    group by time_unit, type_id
                """.trimIndent()
        }
    }

    /**
     * 内存折线图指标
     */
    suspend fun gcLineMetrics(
        input: LineMetricsInput,
        sqlProvider: (LineMetricsInfo) -> String,
    ): GcLineMetricsOutput {
        // 结果封装
        val resultExtract: (Readable, LineMetricsInfo) -> GcLineMetricsMo = { readable, _ ->
            val unit = (readable.get(0) as Number).toLong().toLocalDateTimeByEpochSecond()
                .format(input.rawIntervalType.format)
            val typeId = (readable.get(1) as Number).toInt()
            val value = (readable.get(2) as Number).toLong()

            GcLineMetricsMo(
                unit = unit,
                typeId = typeId,
                value = value,
            )
        }

        // 查询指标
        val result = lineMetrics(input, sqlProvider, resultExtract) { getGcTableNameOfExists(it) }
        val unitMap = result.groupBy { it.unit }
        val typeIdSet = result.map { it.typeId }.toSet()

        val gcTypeMap = getSystemGcTypeMap()
        val gcTypeMapping = gcTypeMap
            .filter { typeIdSet.contains(it.value) }
            .map { it.value to it.key }
            .sortedBy { it.first }
            .associate { (id, label) -> "gcType${id}" to label }


        // 记录上一个窗口的值，用于计算
        val overMap = mutableMapOf<String, Long>()

        // 数据填充
        val data = dateRangeDataCompletion(input) { unit ->
            val item = mutableMapOf<String, Any?>()
            item["unit"] = unit

            val metricsMo = unitMap[unit]
                ?.associate { "gcType${it.typeId}" to it.value }
                ?: mapOf()

            gcTypeMapping.forEach { (key, _) ->
                val value = metricsMo[key]
                if (value != null) {
                    val overVal = overMap[key]
                    item[key] = (if (overVal != null) value - overVal else 0).lessThanZeroLet(null)
                    overMap[key] = value
                } else {
                    overMap.remove(key)
                    item[key] = null
                }
            }

            item
        }

        val mapping = gcTypeMapping.map { (key, label) -> GcMappingOutput(label, key) }

        return GcLineMetricsOutput(
            mapping = mapping,
            data = data
        )
    }

    /**
     * 内存折线图指标
     */
    suspend fun memoryLineMetrics(
        input: LineMetricsInput,
        sqlProvider: (LineMetricsInfo) -> String,
    ): List<MemoryLineMetricsOutput> {
        // 结果封装
        val resultExtract: (Readable, LineMetricsInfo) -> MemoryLineMetricsOutput = { readable, _ ->
            val unit = (readable.get(0) as Number).toLong().toLocalDateTimeByEpochSecond()
                .format(input.rawIntervalType.format)
            val use = (readable.get(1) as Number?)?.toLong()
            val committed = (readable.get(2) as Number?)?.toLong()
            val max = (readable.get(3) as Number?)?.toLong()
            MemoryLineMetricsOutput(
                unit = unit,
                use = use,
                committed = committed,
                max = max
            )
        }

        // 查询指标
        val result = lineMetrics(input, sqlProvider, resultExtract)

        // 数据补全
        return lineMetricsDateRangeDataCompletion(input, result) { it, unit ->
            MemoryLineMetricsOutput(
                unit = unit,
                use = it?.use,
                committed = it?.committed,
                max = it?.max
            )
        }
    }

    /**
     * 支持带别名的片段
     */
    interface AliasFragment {

        fun get(alias: String? = ""): String

    }

    /**
     * 折线图指标指标
     */
    suspend fun <T : LineMetricsOutput> lineMetrics(
        input: LineMetricsInput,
        sqlProvider: (LineMetricsInfo) -> String,
        resultExtract: (Readable, LineMetricsInfo) -> T,
        getTableName: suspend (day: String) -> String? = { getTableNameOfExists(it) },
    ): List<T> {
        val dateRangeMs = input.getDateRange()
        val (form, to) = dateRangeMs

        val tableNames = (0..dateRangeMs.includedDays()).mapNotNull {
            val day = (form + it.toDuration(ChronoUnit.DAYS)).format(DATE_TIME_DAY_NO_SEP_FORMAT)
            getTableName(day)
        }

        if (tableNames.isEmpty()) {
            return emptyList()
        }

        // 获取比间隔时间单位大一个的单位
        val furtherUnit = input.getFurtherUnit()
        val furtherUnitSecond = 1.toDuration(furtherUnit.unit).toSeconds()

        val tableName =
            if (tableNames.size == 1) tableNames[0]
            else "( ${tableNames.joinToString(separator = " union all ") { "select * from $it" }} )"

        val fragment = object : AliasFragment {
            override fun get(alias: String?): String {
                val realAlias = if (alias.isNullOrBlank()) "" else "${alias}."
                return "${realAlias}second_unit between ${form.toEpochSecond()} and ${to.toEpochSecond()}"
            }
        }

        val second = input.getIntervalSecond()
        val info = LineMetricsInfo(tableName, fragment, second, furtherUnitSecond)
        val sql = sqlProvider(info)

        return databaseClient.sql(sql)
            .map { readable: Readable -> resultExtract(readable, info) }
            .all()
            .collectList()
            .awaitSingle()
    }

    data class LineMetricsInfo(
        val tableName: String,
        val requestTimeFragment: AliasFragment,
        val second: Long,
        val furtherUnitSecond: Long,
    )

}
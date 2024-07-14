package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.config.R2dbcConfiguration.Companion.bindByIndex
import cc.shacocloud.greatwall.config.R2dbcConfiguration.Companion.bindByName
import cc.shacocloud.greatwall.model.po.SystemMetricsRecordPo
import cc.shacocloud.greatwall.service.SystemMonitorMetricsService
import cc.shacocloud.greatwall.utils.DATE_TIME_DAY_NO_SEP_FORMAT
import cc.shacocloud.greatwall.utils.days
import cc.shacocloud.greatwall.utils.toEpochSecond
import cc.shacocloud.greatwall.utils.toLocalDateTime
import io.r2dbc.spi.Readable
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.mono
import kotlinx.coroutines.runBlocking
import kotlinx.serialization.encodeToString
import kotlinx.serialization.json.Json
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.r2dbc.core.DatabaseClient
import org.springframework.r2dbc.core.await
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDate
import java.time.LocalDateTime

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
    }

    // 表名集合
    private var tableNameSet: MutableSet<String> = mutableSetOf()

    init {
        val tableNames = runBlocking {
            getAllSystemMonitorMetricsTables()
        }
        tableNameSet.addAll(tableNames)
    }

    /**
     * 删除30天之前的表信息
     */
    @Scheduled(cron = "1 0 0 * * *")
    fun deleteExpirationTables() = mono {
        val current = LocalDateTime.now() - 30.days
        val needDelTables = getAllSystemMonitorMetricsTables()
            .filter {
                val day = it.removePrefix("system_metrics_record_")
                val dayDateTime = LocalDate.parse(day, DATE_TIME_DAY_NO_SEP_FORMAT).atStartOfDay()
                dayDateTime < current
            }

        for (table in needDelTables) {
            databaseClient.sql("drop table if exists $table")
                .await()
        }

        tableNameSet = getAllSystemMonitorMetricsTables()
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
            .filter { it.startsWith("system_metrics_record_") }
            .toMutableSet()
    }


    /**
     * 获取表名称
     * @param day [DATE_TIME_DAY_NO_SEP_FORMAT]
     */
    suspend fun getTableName(day: String): String {
        return "system_metrics_record_${day}"
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
                id                         BIGINT PRIMARY KEY AUTO_INCREMENT,
                second_unit                BIGINT        NOT NULL unique,
                used_heap_memory           BIGINT        NOT NULL,
                max_heap_memory            BIGINT        NOT NULL,
                used_non_heap_memory       BIGINT        NOT NULL,
                max_non_heap_memory        BIGINT        NOT NULL,
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
                direct_memory_use          BIGINT        NOT NULL,
                direct_memory_committed    BIGINT        NOT NULL,
                direct_memory_max          BIGINT        NOT NULL,
                gc_infos                   TEXT          NOT NULL
            )
        """.trimIndent()
        databaseClient.sql(createTableSql).await()

        // 添加表
        tableNameSet.add(tableName)

        return tableName
    }


    override suspend fun addRouteRecord(record: SystemMetricsRecordPo) {
        val day = record.timeUnit.format(DATE_TIME_DAY_NO_SEP_FORMAT)
        val tableName = createTable(day)

        databaseClient.sql(
            """
            insert into ${tableName}(second_unit, used_heap_memory, max_heap_memory, used_non_heap_memory, max_non_heap_memory, cpu_load,
                process_cpu_load, thread_total, thread_new_count, thread_runnable_count, thread_blocked_count,
                thread_waiting_count, thread_timed_waiting_count, thread_terminated_count, loaded_class_count,
                loaded_class_total, unloaded_classes, direct_memory_use, direct_memory_committed, direct_memory_max,
                gc_infos)
           values (:secondUnit, :usedHeapMemory, :maxHeapMemory, :usedNonHeapMemory, :maxNonHeapMemory, :cpuLoad,
                :processCpuLoad, :threadTotal, :threadNewCount, :threadRunnableCount, :threadBlockedCount,
                :threadWaitingCount, :threadTimedWaitingCount, :threadTerminatedCount, :loadedClassCount,
                :loadedClassTotal, :unloadedClasses, :directMemoryUse, :directMemoryCommitted, :directMemoryMax,
                :gcInfos)
        """.trimIndent()
        )
            .bindByName("secondUnit", record.timeUnit.toEpochSecond())
            .bindByName("usedHeapMemory", record.usedHeapMemory)
            .bindByName("maxHeapMemory", record.maxHeapMemory)
            .bindByName("usedNonHeapMemory", record.usedNonHeapMemory)
            .bindByName("maxNonHeapMemory", record.maxNonHeapMemory)
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
            .bindByName("gcInfos", Json.encodeToString(record.gcInfos))
            .await()
    }


}
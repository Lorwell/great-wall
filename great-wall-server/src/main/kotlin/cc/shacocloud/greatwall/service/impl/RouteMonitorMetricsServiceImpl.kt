package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.model.dto.input.RouteMonitorMetricsInput
import cc.shacocloud.greatwall.model.dto.output.RouteMonitorMetricsOutput
import cc.shacocloud.greatwall.model.po.RouteMetricsRecordPo
import cc.shacocloud.greatwall.service.RouteMonitorMetricsService
import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import cc.shacocloud.greatwall.utils.json.Json
import io.questdb.cairo.CairoEngine
import io.questdb.cairo.security.AllowAllSecurityContext
import io.questdb.cairo.wal.ApplyWal2TableJob
import io.questdb.griffin.SqlExecutionContext
import io.questdb.griffin.SqlExecutionContextImpl
import io.questdb.std.str.Utf8String
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.asCoroutineDispatcher
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.channels.Channel.Factory.UNLIMITED
import kotlinx.coroutines.channels.ClosedReceiveChannelException
import kotlinx.coroutines.launch
import org.springframework.beans.factory.DisposableBean
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
) : RouteMonitorMetricsService, DisposableBean {

    val channel = Channel<RouteMetricsRecordPo>(
        capacity = UNLIMITED
    )

    val dispatcher = Executors.newFixedThreadPool(2).asCoroutineDispatcher()

    init {
        @OptIn(DelicateCoroutinesApi::class)
        GlobalScope.launch {
            repeat(2) {
                launch(dispatcher) {
                    try {
                        while (!channel.isClosedForReceive) {
                            val record = channel.receive()
                            consumerData(record)
                        }
                    } catch (_: ClosedReceiveChannelException) {
                    }
                }
            }
        }
    }

    /**
     * 添加监控记录
     */
    @OptIn(DelicateCoroutinesApi::class)
    override suspend fun addRouteRecord(record: RouteMetricsRecordPo) {
        try {
            if (channel.isClosedForSend) {
                consumerData(record)
            } else {
                channel.send(record)
            }

        } catch (e: Exception) {
            if (log.isWarnEnabled) {
                log.warn("添加监控指标记录到队列发生例外！", e)
            }
        }
    }

    override suspend fun requestCountMetrics(input: RouteMonitorMetricsInput): RouteMonitorMetricsOutput {
        val (from, to) = input.getDateRangeMs()

        val ctx: SqlExecutionContext = SqlExecutionContextImpl(cairoEngine, 1)
            .with(AllowAllSecurityContext.INSTANCE, null)

        val compiledQuery = cairoEngine.sqlCompiler.compile(
            "SELECT count(*) FROM monitor_metrics_record WHERE request_time between '2024-06-05 00:00:00' and '2024-06-07 00:00:00'",
            ctx
        )

        return RouteMonitorMetricsOutput(1)
    }

    /**
     * 消费数据
     */
    fun consumerData(record: RouteMetricsRecordPo) {
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
     * WAL 写入器提交的数据不会立即被读者看到。一旦 ApplyWal2TableJob 作业应用了提交的数据，这些数据就会变得可见
     */
    fun applyWal2() {
        ApplyWal2TableJob(cairoEngine, 1, 1).use { walApplyJob ->
            while (true) {
                if (!walApplyJob.run(0)) break
            }
        }
    }


    /**
     * 销毁调度器
     */
    @OptIn(DelicateCoroutinesApi::class)
    override fun destroy() {
        channel.close()

        // 等待全部处理结束
        while (true) {
            if (channel.isClosedForReceive) {
                break
            } else {
                Thread.sleep(100)
            }
        }
        dispatcher.close()

        applyWal2()
    }

}
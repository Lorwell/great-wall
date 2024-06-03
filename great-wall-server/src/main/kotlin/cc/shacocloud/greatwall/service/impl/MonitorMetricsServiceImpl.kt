package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.model.po.MonitorMetricsRecordPo
import cc.shacocloud.greatwall.service.MonitorMetricsService
import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import cc.shacocloud.greatwall.utils.json.Json
import io.questdb.cairo.CairoEngine
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
 *
 * @author 思追(shaco)
 */
@Slf4j
@Service
class MonitorMetricsServiceImpl(
    val cairoEngine: CairoEngine
) : MonitorMetricsService, DisposableBean {

    val channel = Channel<MonitorMetricsRecordPo>(
        capacity = UNLIMITED
    )

    val dispatcher = Executors.newFixedThreadPool(2).asCoroutineDispatcher()

    init {
        repeat(2) {
            @OptIn(DelicateCoroutinesApi::class)
            GlobalScope.launch {
                launch(dispatcher) {
                    try {
                        while (!channel.isClosedForReceive) {
                            val record = channel.receive()

                            try {
                                val tableToken = cairoEngine.getTableTokenIfExists("monitor_metrics_record")
                                cairoEngine.getWalWriter(tableToken).use { writer ->
                                    val row = writer.newRow(record.requestTime)
                                    row.putSym(0, record.ip)
                                    row.putSym(1, record.host)
                                    row.putSym(2, record.method)
                                    row.putVarchar(3, Utf8String(record.contextPath))
                                    row.putVarchar(4, Utf8String(record.appPath))
                                    row.putVarchar(5, Utf8String(Json.encode(record.queryParams)))
                                    row.putVarchar(6, Utf8String(Json.encode(record.cookies)))
                                    row.putTimestamp(7, record.requestTime)
                                    row.putTimestamp(8, record.responseTime)
                                    row.putInt(9, record.statusCode)
                                    row.append()

                                    writer.commit()
                                }

                            } catch (e: Exception) {
                                if (log.isErrorEnabled) {
                                    log.error("保存监控指标记录发生例外！", e)
                                }
                            }
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
    override suspend fun addRecord(record: MonitorMetricsRecordPo) {
        try {
            channel.send(record)
        } catch (e: Exception) {
            if (log.isWarnEnabled) {
                log.warn("添加监控指标记录到队列发生例外！", e)
            }
        }
    }

    /**
     * 销毁调度器
     */
    override fun destroy() {
        dispatcher.close()
    }

}
package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.config.questdb.QUESTDB_WRITE_DISPATCHER
import cc.shacocloud.greatwall.model.po.questdb.BaseMonitorMetricsPo
import cc.shacocloud.greatwall.model.po.questdb.BaseMonitorMetricsPo.Type.ROUTE
import cc.shacocloud.greatwall.model.po.questdb.RouteMetricsRecordPo
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import io.questdb.cairo.CairoEngine
import io.questdb.cairo.wal.ApplyWal2TableJob
import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.channels.Channel
import kotlinx.coroutines.channels.Channel.Factory.UNLIMITED
import kotlinx.coroutines.channels.ClosedReceiveChannelException
import kotlinx.coroutines.launch
import org.springframework.beans.factory.DisposableBean
import org.springframework.stereotype.Service

/**
 *
 * @author 思追(shaco)
 */
@Service
class CompositionMonitorMetricsService(
    val cairoEngine: CairoEngine,
    val routeMonitorMetricsService: RouteMonitorMetricsService
) : DisposableBean {

    val channel = Channel<BaseMonitorMetricsPo>(
        capacity = UNLIMITED
    )

    init {
        @OptIn(DelicateCoroutinesApi::class)
        GlobalScope.launch {
            launch(QUESTDB_WRITE_DISPATCHER) {
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

    /**
     * 添加监控指标记录
     */
    @OptIn(DelicateCoroutinesApi::class)
    suspend fun addMetricsRecord(record: BaseMonitorMetricsPo) {
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

    /**
     * 消费数据方法
     */
    suspend fun consumerData(record: BaseMonitorMetricsPo) {
        when (record.type) {
            ROUTE -> routeMonitorMetricsService.addRouteRecord(record as RouteMetricsRecordPo)
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

        applyWal2()
    }

}
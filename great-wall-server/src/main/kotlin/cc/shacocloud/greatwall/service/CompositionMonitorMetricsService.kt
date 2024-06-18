package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.model.po.BaseMonitorMetricsPo
import cc.shacocloud.greatwall.model.po.BaseMonitorMetricsPo.Type.ROUTE
import cc.shacocloud.greatwall.model.po.RouteMetricsRecordPo
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
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
@Service
class CompositionMonitorMetricsService(
    val routeMonitorMetricsService: RouteMonitorMetricsService
) : DisposableBean {

    val channel = Channel<BaseMonitorMetricsPo>(
        capacity = UNLIMITED
    )

    /**
     *  监控指标数据写入调度器
     */
    val monitorMetricsWriteDispatcher = Executors.newFixedThreadPool(1)
        .asCoroutineDispatcher()


    init {
        @OptIn(DelicateCoroutinesApi::class)
        GlobalScope.launch {
            launch(monitorMetricsWriteDispatcher) {
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
    }

}
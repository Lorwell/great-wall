package cc.shacocloud.greatwall.repository

import cc.shacocloud.greatwall.model.po.MonitorMetricsRecordPo
import org.springframework.data.repository.kotlin.CoroutineCrudRepository

/**
 *
 * @author 思追(shaco)
 */
interface MonitorMetricsRepository : CoroutineCrudRepository<MonitorMetricsRecordPo, Long> {
}
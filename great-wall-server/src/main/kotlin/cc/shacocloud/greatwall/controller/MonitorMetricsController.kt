package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.service.MonitorMetricsService
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

/**
 *
 * @author 思追(shaco)
 */
@Validated
@RestController
@RequestMapping("/api/monitor-metrics")
class MonitorMetricsController(
    val monitorMetricsService: MonitorMetricsService
) {




}
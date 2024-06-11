package cc.shacocloud.greatwall

import cc.shacocloud.greatwall.config.CustomApplicationContextFactory
import cc.shacocloud.greatwall.config.web.WebFluxConfigServerConfiguration
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.scheduling.annotation.EnableScheduling
import java.util.*

/**
 * 当前服务将端口分为2个，主端口和配置端口
 *
 * 主端口只用于执行代理策略
 * 配置端口用于配置代理策略 [WebFluxConfigServerConfiguration]
 *
 *
 */
@EnableScheduling
@SpringBootApplication
class GreatWallApplication

fun main(args: Array<String>) {
    // 设置默认时区
    val timeZoneId = System.getProperty("TIME_ZONE_ID", System.getenv("TIME_ZONE_ID")) ?: "Asia/Shanghai"
    TimeZone.setDefault(TimeZone.getTimeZone(timeZoneId))

    val application = SpringApplication(GreatWallApplication::class.java)

    // 自定义应用上下文工厂
    application.setApplicationContextFactory(CustomApplicationContextFactory())
    application.run(*args)
}

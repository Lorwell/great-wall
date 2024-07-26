package cc.shacocloud.greatwall

import cc.shacocloud.greatwall.config.CustomApplicationContextFactory
import cc.shacocloud.greatwall.config.web.WebFluxServerConfiguration
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.scheduling.annotation.EnableScheduling
import java.util.*

/**
 * 当前服务将端口分为2个，主端口和配置端口
 *
 * @see [WebFluxServerConfiguration]
 */
@EnableScheduling
@SpringBootApplication
class GreatWallApplication

fun main(args: Array<String>) {
    // 设置默认时区
    val timeZoneId = System.getProperty("TIME_ZONE_ID", System.getenv("TIME_ZONE_ID")) ?: "Asia/Shanghai"
    TimeZone.setDefault(TimeZone.getTimeZone(timeZoneId))

    // 设置 netty 链接策略，
    System.setProperty("reactor.netty.pool.leasingStrategy", "lifo")

    val application = SpringApplication(GreatWallApplication::class.java)

    // 自定义应用上下文工厂
    application.setApplicationContextFactory(CustomApplicationContextFactory())
    application.run(*args)
}

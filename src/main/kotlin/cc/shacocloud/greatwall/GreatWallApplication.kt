package cc.shacocloud.greatwall

import cc.shacocloud.greatwall.config.AutoTLSReactiveWebServerApplicationContext
import cc.shacocloud.greatwall.config.CustomApplicationContextFactory
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication

@SpringBootApplication
class GreatWallApplication

fun main(args: Array<String>) {
    val application = SpringApplication(GreatWallApplication::class.java)
    // 自定义应用上下文工厂
    application.setApplicationContextFactory(CustomApplicationContextFactory())
    val applicationContext = application.run(*args) as AutoTLSReactiveWebServerApplicationContext

    Thread.sleep(1_000)

    applicationContext.refreshWebserver()

}

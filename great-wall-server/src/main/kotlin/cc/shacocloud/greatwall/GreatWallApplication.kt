package cc.shacocloud.greatwall

import cc.shacocloud.greatwall.config.AutoTLSReactiveWebServerApplicationContext
import cc.shacocloud.greatwall.config.CustomApplicationContextFactory
import cc.shacocloud.greatwall.config.OsfipinProperties
import cc.shacocloud.greatwall.service.TLSService
import org.springframework.boot.SpringApplication
import org.springframework.boot.autoconfigure.SpringBootApplication

@SpringBootApplication
class GreatWallApplication

fun main(args: Array<String>) {
    val application = SpringApplication(GreatWallApplication::class.java)

    // 自定义应用上下文工厂
    application.setApplicationContextFactory(CustomApplicationContextFactory())
    val applicationContext = application.run(*args) as AutoTLSReactiveWebServerApplicationContext

    // 加载证书文件
    val tlsService = applicationContext.getBean(TLSService::class.java)
    val properties = OsfipinProperties(
        baseUrl = "https://api.osfipin.com/letsencrypt/api",
        token = "f9c22e612cc15056fdc3c7c902b5882e",
        user = "1679924785@qq.com",
        autoId = "5r8r9e"
    )
    val sslBundleProperties = tlsService.load(properties)

    // 刷新证书配置，重新启动web服务
    applicationContext.refreshSslBundle(sslBundleProperties)
    applicationContext.refreshWebserver()

}

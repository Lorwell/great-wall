package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.config.OsfipinProperties
import cc.shacocloud.greatwall.utils.ApplicationContextHolder
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.util.Date
import java.util.concurrent.TimeUnit
import java.util.concurrent.locks.ReentrantLock

/**
 * @author 思追(shaco)
 */
@Service
class AutoRefreshTLSService {

    private var expirationTime: Date? = null

    /**
     * 每隔一小时刷新一次证书
     */
    @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.HOURS)
    fun refreshTls() {
        if (!ApplicationContextHolder.available()) return

        // 获取当前证书的过期时间
        val currentExpirationTime = this.expirationTime ?: reload()

        // 证书到期前一天更新证书
        val before1Day = Date(Date().time + 24 * 60 * 60 * 1000)
        if (currentExpirationTime.before(before1Day)) {
            this.expirationTime = reload()
        }
    }

    /**
     * 重新加载证书
     */
    fun reload(): Date {
        // 加载证书文件
        val applicationContext = ApplicationContextHolder.getInstance()
        val tlsService = applicationContext.getBean(TLSService::class.java)
        val properties = OsfipinProperties(
            baseUrl = "https://api.osfipin.com/letsencrypt/api",
            token = "f9c22e612cc15056fdc3c7c902b5882e",
            user = "1679924785@qq.com",
            id = "63m7jd",
            autoId = "5r8r9e"
        )
        val (sslBundleProperties, expirationTime) = tlsService.load(properties)

        // 刷新证书配置，重新启动web服务
        applicationContext.refreshSslBundle(sslBundleProperties)
        applicationContext.refreshWebserver()

        return expirationTime
    }

}
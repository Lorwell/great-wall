package cc.shacocloud.greatwall.scheduled

import cc.shacocloud.greatwall.service.TLSService
import cc.shacocloud.greatwall.utils.ApplicationContextHolder
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.util.*
import java.util.concurrent.TimeUnit

/**
 * 自动刷新 tls证书调度
 *
 * @author 思追(shaco)
 */
@Service
class AutoRefreshTLSScheduled {

    private var expirationTime: Date? = null

    /**
     * 每隔一小时刷新一次证书
     */
    @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.HOURS, initialDelayString = "PT2S")
    fun refreshTls() {
        if (!ApplicationContextHolder.available()) return

        // 获取当前证书的过期时间
        var currentExpirationTime = this.expirationTime ?: reload()

        // 证书到期前一天更新证书
        val before1Day = Date(Date().time + 24 * 60 * 60 * 1000)
        if (currentExpirationTime.before(before1Day)) {
            currentExpirationTime = reload()
        }

        this.expirationTime = currentExpirationTime
    }

    /**
     * 重新加载证书
     */
    fun reload(): Date {
        // 加载证书文件
        val applicationContext = ApplicationContextHolder.getInstance()
        val tlsService = applicationContext.getBean(TLSService::class.java)
        val (sslBundleProperties, expirationTime) = tlsService.load()

        // 刷新证书配置，重新启动web服务
        applicationContext.refreshSslBundle(sslBundleProperties)
        applicationContext.refreshWebserver()

        return expirationTime
    }

}
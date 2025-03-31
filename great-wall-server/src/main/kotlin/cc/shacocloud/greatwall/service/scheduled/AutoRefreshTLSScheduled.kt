package cc.shacocloud.greatwall.service.scheduled

import cc.shacocloud.greatwall.model.event.DeleteTlsEvent
import cc.shacocloud.greatwall.model.event.RefreshTlsEvent
import cc.shacocloud.greatwall.model.mo.TlsBundleMo
import cc.shacocloud.greatwall.service.TlsService
import cc.shacocloud.greatwall.utils.ApplicationContextHolder
import cc.shacocloud.greatwall.utils.days
import cc.shacocloud.greatwall.utils.hours
import kotlinx.coroutines.reactor.mono
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.event.EventListener
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import java.time.LocalDateTime
import java.util.concurrent.TimeUnit

/**
 * 自动刷新 tls证书调度
 *
 * @author 思追(shaco)
 */
@Service
class AutoRefreshTLSScheduled(
    val tlsService: TlsService,
) {

    companion object {
        private val log: Logger = LoggerFactory.getLogger(AutoRefreshTLSScheduled::class.java)
    }

    /**
     * 每隔一小时刷新一次证书
     */
    @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.HOURS, initialDelayString = "PT2S")
    fun refreshTls() = mono {
        if (!ApplicationContextHolder.available()) return@mono
        val tlsPo = tlsService.findTlsPo() ?: return@mono

        // 获取当前证书的过期时间
        val expirationTime = tlsService.getTlsExpiredTime(tlsPo)
        if (expirationTime == null) {
            if (log.isWarnEnabled) {
                log.warn("无法获取当前证书过期时间忽略证书自动更新！")
            }
            return@mono
        }

        val currentTime = LocalDateTime.now()

        // 敏感期，满足即刷新
        val sensitivePeriod = expirationTime - 24.hours
        if (sensitivePeriod <= currentTime) {
            tlsService.refresh()
            refreshTlsBundle()
            return@mono
        }

        // 正常更新时间，每天的 2点-5点更新
        val updatedPeriod = expirationTime - 3.days
        if (updatedPeriod <= currentTime) {
            val hour = currentTime.hour
            if (hour in 2..5) {
                tlsService.refresh()
                refreshTlsBundle()
                return@mono
            }
        }
    }

    /**
     * 应用启动成功事件
     */
    @EventListener(ApplicationReadyEvent::class)
    fun appReady() = mono {
        refreshTlsBundle()
    }

    /**
     * 删除证书事件
     */
    @EventListener(DeleteTlsEvent::class)
    fun deleteTlsEvent() = mono {
        if (log.isInfoEnabled) {
            log.info("收到删除tls证书事件！")
        }

        if (ApplicationContextHolder.available()) {
            val applicationContext = ApplicationContextHolder.getInstance()
            applicationContext.deleteSslBundle()
            applicationContext.refreshWebserver()
        }
    }

    /**
     * 刷新证书事件
     */
    @EventListener(RefreshTlsEvent::class)
    fun refreshTlsEvent(event: RefreshTlsEvent) = mono {
        if (log.isInfoEnabled) {
            log.info("收到刷新tls证书事件！")
        }

        refreshTlsBundle(event.tlsBundleMo)
    }

    /**
     * 重新加载证书，并且重启服务
     */
    suspend fun refreshTlsBundle(tlsBundleMo: TlsBundleMo? = null) {
        if (!ApplicationContextHolder.available()) return

        // 加载证书文件
        val applicationContext = ApplicationContextHolder.getInstance()
        val tlsBundle = tlsBundleMo ?: tlsService.load()

        if (tlsBundle == null) {
            if (log.isWarnEnabled) {
                log.warn("当前未配置证书跳过证书刷新！")
            }
            return
        }

        // 刷新证书配置，重新启动web服务
        applicationContext.refreshSslBundle(tlsBundle.properties)
        applicationContext.refreshWebserver()
    }

}
package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.model.event.RefreshTlsEvent
import cc.shacocloud.greatwall.model.mo.TlsBundleMo
import cc.shacocloud.greatwall.utils.ApplicationContextHolder
import cc.shacocloud.greatwall.utils.Slf4j
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
@Slf4j
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

        // 获取当前证书的过期时间
        val currentExpirationTime = tlsService.getTlsExpiredTime()

        // 证书到期前一段时间更新证书
        val updateTime = LocalDateTime.now() - 12.hours
        if (currentExpirationTime != null && currentExpirationTime <= updateTime) {
            tlsService.refresh()
            refreshTlsBundle()
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
     * 刷新证书时间
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
package cc.shacocloud.greatwall.scheduled

import cc.shacocloud.greatwall.model.event.RefreshTlsEvent
import cc.shacocloud.greatwall.service.TlsService
import cc.shacocloud.greatwall.utils.ApplicationContextHolder
import cc.shacocloud.greatwall.utils.Slf4j
import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import cc.shacocloud.greatwall.utils.hours
import kotlinx.coroutines.reactor.mono
import org.springframework.context.event.EventListener
import org.springframework.scheduling.annotation.Scheduled
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import org.springframework.transaction.event.TransactionalEventListener
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
     * 刷新证书时间
     */
    @TransactionalEventListener(RefreshTlsEvent::class)
    fun refreshTlsEvent() = mono {
        refreshTlsBundle()
    }

    /**
     * 重新加载证书，并且重启服务
     */
    suspend fun refreshTlsBundle() {
        if (!ApplicationContextHolder.available()) return

        // 加载证书文件
        val applicationContext = ApplicationContextHolder.getInstance()
        val tlsLoadMo = tlsService.load()

        if (tlsLoadMo == null) {
            if (log.isWarnEnabled) {
                log.warn("当前未配置证书跳过证书刷新！")
            }
            return
        }

        // 刷新证书配置，重新启动web服务
        applicationContext.refreshSslBundle(tlsLoadMo.properties)
        applicationContext.refreshWebserver()
    }

}
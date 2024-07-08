package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.model.Settings
import cc.shacocloud.greatwall.model.event.SettingsUpdateEvent
import kotlinx.coroutines.reactor.mono
import kotlinx.coroutines.sync.Mutex
import kotlinx.coroutines.sync.withLock
import org.springframework.context.event.EventListener
import org.springframework.stereotype.Service

/**
 * 系统设置事件监听器
 * @author 思追(shaco)
 */
@Service
class SettingsEventListener {

    private val mutex = Mutex()

    /**
     * 配置更新事件
     */
    @EventListener(SettingsUpdateEvent::class)
    fun updateSettings(event: SettingsUpdateEvent) = mono {
        mutex.withLock {
            val settings = event.settings
            Settings.redirectHttps.set(settings.redirectHttps)
        }

    }

}
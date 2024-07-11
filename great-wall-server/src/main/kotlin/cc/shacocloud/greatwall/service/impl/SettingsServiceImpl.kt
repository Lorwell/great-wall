package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.model.dto.SettingsDto
import cc.shacocloud.greatwall.model.po.SettingsPo
import cc.shacocloud.greatwall.repository.SettingsRepository
import cc.shacocloud.greatwall.service.SettingsService
import cc.shacocloud.greatwall.utils.converter.convertToMap
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

/**
 *
 * @author 思追(shaco)
 */
@Service
@Transactional(rollbackFor = [Exception::class])
class SettingsServiceImpl(
    val settingsRepository: SettingsRepository
) : SettingsService {

    /**
     * 查询系统设置
     */
    override suspend fun find(): List<SettingsPo> {
        return settingsRepository.findAll().collectList().awaitSingle()
    }

    /**
     * 更新系统设置
     */
    override suspend fun update(settings: SettingsDto): List<SettingsPo> {
        val settingsMap = find().associateBy { it.name }.toMutableMap()
        val newSettings = settings.convertToMap()

        val add = mutableListOf<SettingsPo>()
        val update = mutableListOf<SettingsPo>()

        for ((name, value) in newSettings) {
            val settingsPo = settingsMap.remove(name)

            if (settingsPo == null) {
                add.add(
                    SettingsPo(
                        name = name,
                        value = value,
                        createTime = Date(),
                        lastUpdateTime = Date()
                    )
                )
            } else {
                settingsPo.value = value
                settingsPo.lastUpdateTime = Date()
                update.add(settingsPo)
            }
        }

        val delete = settingsMap.values
        if (delete.isNotEmpty()) {
            settingsRepository.deleteAll(delete).awaitSingle()
        }

        if (add.isNotEmpty()) {
            settingsRepository.saveAll(add).collectList().awaitSingle()
        }

        if (update.isNotEmpty()) {
            settingsRepository.saveAll(update).collectList().awaitSingle()
        }

        return find()
    }

}
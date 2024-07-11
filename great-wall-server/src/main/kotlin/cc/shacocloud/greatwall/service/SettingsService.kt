package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.model.dto.SettingsDto
import cc.shacocloud.greatwall.model.po.SettingsPo

/**
 *
 * @author 思追(shaco)
 */
interface SettingsService {

    /**
     * 查询系统设置
     */
    suspend fun find(): List<SettingsPo>

    /**
     * 更新系统设置
     */
    suspend fun update(settings: SettingsDto): List<SettingsPo>

}
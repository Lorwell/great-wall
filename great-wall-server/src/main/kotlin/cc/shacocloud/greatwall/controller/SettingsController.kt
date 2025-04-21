package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.controller.interceptor.UserAuth
import cc.shacocloud.greatwall.model.dto.SettingsDto
import cc.shacocloud.greatwall.model.event.SettingsUpdateEvent
import cc.shacocloud.greatwall.service.SettingsService
import cc.shacocloud.greatwall.utils.ApplicationContextHolder
import cc.shacocloud.greatwall.utils.converter.convertToBean
import org.springframework.transaction.annotation.Transactional
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

/**
 * 系统设置控制器
 * @author 思追(shaco)
 */
@UserAuth
@Validated
@RestController
@RequestMapping("/api/settings")
@Transactional(rollbackFor = [Exception::class])
class SettingsController(
    val settingsService: SettingsService
) {

    /**
     * 更新系统设置
     */
    @PutMapping
    suspend fun update(@RequestBody @Validated settings: SettingsDto): SettingsDto {
        val settingsPos = settingsService.update(settings)
        val settingsDto = settingsPos.associate { it.name to it.value }.convertToBean(SettingsDto::class)

        // 发布更新设置事件
        ApplicationContextHolder.getInstance().publishEvent(SettingsUpdateEvent(settingsDto))

        return settingsDto
    }

    /**
     * 系统设置详情
     */
    @GetMapping
    suspend fun details(): SettingsDto {
        val settingsPos = settingsService.find()
        return settingsPos.associate { it.name to it.value }.convertToBean(SettingsDto::class)
    }


}
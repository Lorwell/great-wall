package cc.shacocloud.greatwall.model.event

import cc.shacocloud.greatwall.model.dto.SettingsDto

/**
 *
 * @author 思追(shaco)
 */
data class SettingsUpdateEvent(
    val settings: SettingsDto
)

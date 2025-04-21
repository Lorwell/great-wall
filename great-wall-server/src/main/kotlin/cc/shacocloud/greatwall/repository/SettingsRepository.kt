package cc.shacocloud.greatwall.repository

import cc.shacocloud.greatwall.model.po.SettingsPo
import org.springframework.stereotype.Repository

/**
 *
 * @author 思追(shaco)
 */
@Repository
interface SettingsRepository : R2dbcRepository<SettingsPo> {
}
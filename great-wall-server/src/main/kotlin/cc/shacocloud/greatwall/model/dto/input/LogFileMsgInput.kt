package cc.shacocloud.greatwall.model.dto.input

import kotlinx.serialization.Serializable

/**
 *
 * @author 思追(shaco)
 */
@Serializable
data class LogFileMsgInput(

    /**
     * 是否自动刷新
     */
    val autoRefresh: Boolean
)

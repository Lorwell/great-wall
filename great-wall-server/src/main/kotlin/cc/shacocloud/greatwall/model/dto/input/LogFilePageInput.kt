package cc.shacocloud.greatwall.model.dto.input

import kotlinx.serialization.Serializable

/**
 *
 * @author 思追(shaco)
 */
@Serializable
data class LogFilePageInput(

    /**
     * 尝试读取的行数，默认为30行
     */
    val lineNumber: Int = 30
)

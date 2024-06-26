package cc.shacocloud.greatwall.model.dto.output

import cc.shacocloud.greatwall.model.dto.convert.LogEnum
import java.util.*

/**
 *
 * @author 思追(shaco)
 */
data class LogListOutput(
    val name: String,
    val type: LogEnum,
    val size: Int,
    val path: String,
    val createTime: Date,
    val lastUpdateTime: Date
)

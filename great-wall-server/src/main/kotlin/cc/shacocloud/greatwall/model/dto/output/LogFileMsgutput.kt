package cc.shacocloud.greatwall.model.dto.output

import kotlinx.serialization.Serializable

/**
 * @author 思追(shaco)
 */
@Serializable
data class LogFileMsgutput(

    /**
     * 是否已经达到尾行
     */
    val lastLine: Boolean = false,

    /**
     * 行数据
     */
    val line: String? = null

)

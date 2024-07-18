package cc.shacocloud.greatwall.model.mo

import kotlinx.serialization.Serializable

/**
 *
 * @author 思追(shaco)
 */
@Serializable
data class GCInfoMo(

    /**
     * gc名称
     */
    val name: String,

    /**
     * gc 计数
     */
    val count: Long,

    /**
     * gc 时间
     */
    val time: Long

)
package cc.shacocloud.greatwall.model.dto.output

import cc.shacocloud.greatwall.model.po.StaticResourcesPo
import java.time.LocalDateTime
import java.util.Date

/**
 * @author 思追(shaco)
 */
data class StaticResourcesOutput(

    val id: Long,

    /**
     * 名称
     */
    val name: String,

    /**
     * 描述
     */
    val describe: String? = null,

    /**
     * 创建时间
     */
    val createTime: Date,

    /**
     * 最后更新时间
     */
    val lastUpdateTime: Date
) {

    companion object {

        fun StaticResourcesPo.toOutput(): StaticResourcesOutput {
            return StaticResourcesOutput(
                id = id!!,
                name = name,
                describe = describe,
                createTime = createTime,
                lastUpdateTime = lastUpdateTime
            )
        }
    }

}
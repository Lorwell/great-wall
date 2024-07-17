package cc.shacocloud.greatwall.model.dto.output

/**
 * 内存折线图指标结果
 * @author 思追(shaco)
 */
data class MemoryLineMetricsOutput(

    /**
     * 单元
     */
    override val unit: String,

    /**
     * 使用
     */
    val use: Long? = null,

    /**
     * 提交
     */
    val committed: Long? = null,

    /**
     * 最大
     */
    val max: Long? = null,

    ) : LineMetricsOutput(unit)

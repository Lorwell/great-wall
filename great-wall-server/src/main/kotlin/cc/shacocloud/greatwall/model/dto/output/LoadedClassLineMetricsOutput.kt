package cc.shacocloud.greatwall.model.dto.output

/**
 * 类加载折线图指标结果
 * @author 思追(shaco)
 */
data class LoadedClassLineMetricsOutput(

    /**
     * 单元
     */
    override val unit: String,

    /**
     * 总加载类计数
     */
    val total: Long? = null,

    /**
     * 加载的类计数
     */
    val count: Int? = null,

    /**
     * 卸载的类
     */
    val unloaded: Long? = null,

    ) : LineMetricsOutput(unit)

package cc.shacocloud.greatwall.model.dto.output

/**
 * 线程折线图指标结果
 * @author 思追(shaco)
 */
data class ThreadLineMetricsOutput(

    /**
     * 单元
     */
    override val unit: String,

    /**
     * 线程状态[Thread.State.NEW]统计
     */
    val new: Int? = null,

    /**
     * 线程状态[Thread.State.RUNNABLE]统计
     */
    val runnable: Int? = null,

    /**
     * 线程状态[Thread.State.BLOCKED]统计
     */
    val blocked: Int? = null,

    /**
     * 线程状态[Thread.State.WAITING]统计
     */
    val waiting: Int? = null,

    /**
     * 线程状态[Thread.State.TIMED_WAITING]统计
     */
    val timedWaiting: Int? = null,

    /**
     * 线程状态[Thread.State.TERMINATED]统计
     */
    val terminated: Int? = null,

    ) : LineMetricsOutput(unit)

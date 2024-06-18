package cc.shacocloud.greatwall.model.po

/**
 * 监控指标基础模型
 * @author 思追(shaco)
 */
open class BaseMonitorMetricsPo(

    val type: Type

) {

    enum class Type {

        ROUTE
    }

}
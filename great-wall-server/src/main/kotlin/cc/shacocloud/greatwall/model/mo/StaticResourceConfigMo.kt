package cc.shacocloud.greatwall.model.mo

/**
 * @author 思追(shaco)
 */
data class StaticResourceConfigMo(

    /**
     * 默认的主页
     */
    val index: String,

    /**
     * 404 重定向
     *
     * 如果为 null 则表示不开启
     */
    val redirect404: String? = null
)

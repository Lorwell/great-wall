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
     * 404 时使用指定文件返回
     *
     * 如果为 null 则表示不开启
     */
    val tryfile404: String? = null
) {

    companion object {
        val DEFAULT = StaticResourceConfigMo(index = "index.html")

        fun RouteStaticResourcesTargetConfig.toConfigMo(): StaticResourceConfigMo {
            return StaticResourceConfigMo(
                index = index,
                tryfile404 = tryfile404
            )
        }
    }
}
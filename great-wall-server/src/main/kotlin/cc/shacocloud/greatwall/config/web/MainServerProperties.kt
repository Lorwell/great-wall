package cc.shacocloud.greatwall.config.web

import org.springframework.boot.context.properties.ConfigurationProperties

/**
 *
 * @author 思追(shaco)
 */
@ConfigurationProperties("server.main-server")
data class MainServerProperties(

    /**
     * 非 tls 端口
     */
    val port: Int,

    /**
     * 默认选择器线程数，回退到 1（无选择器线程）
     * 注意： 在大多数情况下，使用工作线程也作为选择器线程效果很好。指定单独的选择器线程的一个可能用例可能是当工作线程太忙并且无法足够快地接受连接时。
     * 注意： 虽然可以将超过 1 个线程配置为选择器线程计数，但实际上只有 1 个线程将用作选择器线程。
     */
    val ioSelectCount: Int,

    /**
     * 默认工作线程计数，如果设置的值小于等于0则回退到可用处理器（最小值为 4）
     */
    val ioWorkCount: Int,
    )
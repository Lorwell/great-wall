package cc.shacocloud.greatwall.config

import org.springframework.beans.factory.support.DefaultSingletonBeanRegistry
import org.springframework.boot.autoconfigure.ssl.JksSslBundleProperties
import org.springframework.boot.autoconfigure.ssl.PemSslBundleProperties
import org.springframework.boot.autoconfigure.ssl.PropertiesSslBundle
import org.springframework.boot.autoconfigure.ssl.SslBundleProperties
import org.springframework.boot.web.embedded.netty.NettyReactiveWebServerFactory
import org.springframework.boot.web.reactive.context.ReactiveWebServerApplicationContext
import org.springframework.boot.web.server.Ssl
import org.springframework.context.SmartLifecycle

/**
 * 基于 [ReactiveWebServerApplicationContext] 的自定义tls证书刷新上下文，支持重新指定证书后，重启启动web服务
 * @author 思追(shaco)
 */
class AutoTLSReactiveWebServerApplicationContext : ReactiveWebServerApplicationContext() {

    // 内置的ssl证书名称
    private val builtSslBundleName = "_built_ssl_bundle"

    /**
     * 重启 web 服务
     */
    fun refreshWebserver() {
        val customSslBundleRegistry = getBean(CustomSslBundleRegistry::class.java)
        val nettyReactiveWebServerFactory = getBean(NettyReactiveWebServerFactory::class.java)

        // 判断该证书配置是否存在，存在设置为 web ssl 证书
        if (customSslBundleRegistry.existsBundle(builtSslBundleName)) {
            nettyReactiveWebServerFactory.ssl = Ssl.forBundle(builtSslBundleName)
        }
        // 不存在则关闭 ssl 证书
        else {
            nettyReactiveWebServerFactory.ssl = Ssl().apply { isEnabled = false }
        }

        // 停止web服务
        val webServer = getWebServer()
        webServer.stop()

        // 反射设置 WebServerManager 为空，方便后续 onRefresh 方法执行
        val field = ReactiveWebServerApplicationContext::class.java.getDeclaredField("serverManager")
        field.trySetAccessible()
        field.set(this, null)

        // 反射删除之前的bean
        val declaredMethod =
            DefaultSingletonBeanRegistry::class.java.getDeclaredMethod("removeSingleton", String::class.java)
        declaredMethod.trySetAccessible()

        beanFactory.destroyBean("webServerGracefulShutdown")
        declaredMethod.invoke(beanFactory, "webServerGracefulShutdown")

        declaredMethod.invoke(beanFactory, "webServerStartStop")
        beanFactory.destroyBean("webServerStartStop")

        // 重新创建一个web服务
        onRefresh()

        // 启动服务
        val webServerStartStop = beanFactory.getBean("webServerStartStop") as SmartLifecycle
        webServerStartStop.start();
    }

    /**
     * 刷新证书
     */
    fun refreshSslBundle(sslBundleProperties: SslBundleProperties) {

        // 将证书更新到 SslBundles
        val customSslBundleRegistry = getBean(CustomSslBundleRegistry::class.java)

        // 加载证书
        val sslBundle = when (sslBundleProperties) {
            JksSslBundleProperties::class -> PropertiesSslBundle.get(sslBundleProperties as JksSslBundleProperties)
            PemSslBundleProperties::class -> PropertiesSslBundle.get(sslBundleProperties as PemSslBundleProperties)
            else -> throw IllegalArgumentException("未知的 SslBundleProperties 实现类：${sslBundleProperties::class.java}")
        }

        // 判断该证书配置是否存在，存在则更新
        if (customSslBundleRegistry.existsBundle(builtSslBundleName)) {
            customSslBundleRegistry.updateBundle(builtSslBundleName, sslBundle)
        }
        // 不存在则新增
        else {
            customSslBundleRegistry.registerBundle(builtSslBundleName, sslBundle)
        }
    }


}
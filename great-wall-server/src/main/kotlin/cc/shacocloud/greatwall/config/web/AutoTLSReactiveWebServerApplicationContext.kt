package cc.shacocloud.greatwall.config.web

import cc.shacocloud.greatwall.config.web.MainNettyReactiveWebServerFactory.Companion.MAIN_HTTP_HANDLER_BEAN_NAME
import cc.shacocloud.greatwall.config.web.MainNettyReactiveWebServerFactory.Companion.MAIN_NETTY_REACTIVE_WEB_SERVER_FACTORY_BEAN_NAME
import org.springframework.beans.factory.support.DefaultSingletonBeanRegistry
import org.springframework.boot.autoconfigure.ssl.JksSslBundleProperties
import org.springframework.boot.autoconfigure.ssl.PemSslBundleProperties
import org.springframework.boot.autoconfigure.ssl.PropertiesSslBundle
import org.springframework.boot.autoconfigure.ssl.SslBundleProperties
import org.springframework.boot.ssl.SslBundle
import org.springframework.boot.web.embedded.netty.NettyReactiveWebServerFactory
import org.springframework.boot.web.reactive.context.ReactiveWebServerApplicationContext
import org.springframework.boot.web.reactive.server.ReactiveWebServerFactory
import org.springframework.boot.web.server.Ssl
import org.springframework.context.SmartLifecycle
import org.springframework.http.server.reactive.HttpHandler


/**
 * 基于 [ReactiveWebServerApplicationContext] 的自定义tls证书刷新上下文，支持重新指定证书后，重启启动web服务
 *
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
        val nettyReactiveWebServerFactory =
            getWebServerFactory(webServerFactoryBeanName) as MainNettyReactiveWebServerFactory

        // 判断该证书配置是否存在，存在设置为 web ssl 证书
        if (customSslBundleRegistry.existsBundle(builtSslBundleName)) {
            nettyReactiveWebServerFactory.ssl = Ssl.forBundle(builtSslBundleName)
        }
        // 不存在则关闭 ssl 证书
        else {
            nettyReactiveWebServerFactory.ssl = Ssl().apply { isEnabled = false }
        }

        // 停止web服务
        webServer?.stop()

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
        webServerStartStop.start()
    }

    /**
     * 删除证书，执行后如需生效请调用 refreshWebserver 方法重启 web 服务
     */
    fun deleteSslBundle() {
        // 删除该证书凭证
        val customSslBundleRegistry = getBean(CustomSslBundleRegistry::class.java)
        customSslBundleRegistry.removeBundle(builtSslBundleName)
    }

    /**
     * 刷新证书，执行后如需生效请调用 refreshWebserver 方法重启 web 服务
     */
    fun refreshSslBundle(sslBundleProperties: SslBundleProperties): SslBundle {

        // 将证书更新到 SslBundles
        val customSslBundleRegistry = getBean(CustomSslBundleRegistry::class.java)

        // 加载证书
        val sslBundle = when (sslBundleProperties) {
            is JksSslBundleProperties -> PropertiesSslBundle.get(sslBundleProperties)
            is PemSslBundleProperties -> PropertiesSslBundle.get(sslBundleProperties)
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

        return sslBundle
    }

    /**
     * 将主端口的服务只绑定一个网关的转发路由映射处理器
     */
    override fun getHttpHandler(): HttpHandler {
        return getBean(MAIN_HTTP_HANDLER_BEAN_NAME, HttpHandler::class.java)
    }

    override fun getWebServerFactoryBeanName(): String {
        return MAIN_NETTY_REACTIVE_WEB_SERVER_FACTORY_BEAN_NAME
    }

    override fun getWebServerFactory(factoryBeanName: String): ReactiveWebServerFactory {
        return getBean(factoryBeanName, NettyReactiveWebServerFactory::class.java)
    }
}
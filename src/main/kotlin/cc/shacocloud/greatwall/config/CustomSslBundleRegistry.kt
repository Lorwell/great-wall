package cc.shacocloud.greatwall.config

import org.apache.commons.logging.Log
import org.apache.commons.logging.LogFactory
import org.springframework.boot.ssl.*
import org.springframework.core.log.LogMessage
import org.springframework.stereotype.Component
import org.springframework.util.Assert
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CopyOnWriteArrayList
import java.util.function.Consumer
import kotlin.concurrent.Volatile

/**
 * 自定义 ssl Bundle 注册表，支持删除用于[AutoTLSReactiveWebServerApplicationContext]，参考：[DefaultSslBundleRegistry]
 */
@Component
class CustomSslBundleRegistry : SslBundleRegistry, SslBundles {

    private val registeredBundles: MutableMap<String, RegisteredSslBundle> = ConcurrentHashMap()

    companion object {
        private val logger: Log = LogFactory.getLog(CustomSslBundleRegistry::class.java)
    }

    override fun registerBundle(name: String, bundle: SslBundle) {
        Assert.notNull(name, "Name must not be null")
        Assert.notNull(bundle, "Bundle must not be null")
        val previous = registeredBundles.putIfAbsent(name, RegisteredSslBundle(name, bundle))
        Assert.state(previous == null) { "Cannot replace existing SSL bundle '%s'".formatted(name) }
    }

    override fun updateBundle(name: String, updatedBundle: SslBundle) {
        getRegistered(name).update(updatedBundle)
    }

    override fun getBundle(name: String): SslBundle {
        return getRegistered(name).bundle
    }

    /**
     * 指定名称的证书是否存在
     */
    fun existsBundle(name: String): Boolean {
        return registeredBundles.containsKey(name)
    }

    /**
     * 删除指定名称的证书
     */
    fun removeBundle(name: String) {
        registeredBundles.remove(name)
    }


    @Throws(NoSuchSslBundleException::class)
    override fun addBundleUpdateHandler(name: String, updateHandler: Consumer<SslBundle>) {
        getRegistered(name).addUpdateHandler(updateHandler)
    }

    @Throws(NoSuchSslBundleException::class)
    private fun getRegistered(name: String): RegisteredSslBundle {
        Assert.notNull(name, "Name must not be null")
        val registered = registeredBundles[name]
            ?: throw NoSuchSslBundleException(name, "SSL bundle name '%s' cannot be found".formatted(name))
        return registered
    }

    private class RegisteredSslBundle(private val name: String, @field:Volatile var bundle: SslBundle) {
        private val updateHandlers: MutableList<Consumer<SslBundle>> = CopyOnWriteArrayList()

        fun update(updatedBundle: SslBundle) {
            Assert.notNull(updatedBundle, "UpdatedBundle must not be null")
            this.bundle = updatedBundle
            if (updateHandlers.isEmpty()) {
                logger.warn(
                    LogMessage.format(
                        "SSL bundle '%s' has been updated but may be in use by a technology that doesn't support SSL reloading",
                        this.name
                    )
                )
            }
            updateHandlers.forEach(Consumer { handler: Consumer<SslBundle> -> handler.accept(updatedBundle) })
        }

        fun addUpdateHandler(updateHandler: Consumer<SslBundle>) {
            Assert.notNull(updateHandler, "UpdateHandler must not be null")
            updateHandlers.add(updateHandler)
        }
    }

}

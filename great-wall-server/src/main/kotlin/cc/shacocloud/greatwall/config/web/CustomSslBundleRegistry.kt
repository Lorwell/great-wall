package cc.shacocloud.greatwall.config.web

import org.apache.commons.logging.Log
import org.apache.commons.logging.LogFactory
import org.springframework.beans.factory.ObjectProvider
import org.springframework.boot.autoconfigure.ssl.SslBundleRegistrar
import org.springframework.boot.ssl.*
import org.springframework.stereotype.Component
import java.util.*
import java.util.concurrent.ConcurrentHashMap
import java.util.concurrent.CopyOnWriteArrayList
import java.util.function.Consumer

/**
 * 自定义 ssl Bundle 注册表，支持删除用于[AutoTLSReactiveWebServerApplicationContext]，参考：[DefaultSslBundleRegistry]
 */
@Component
class CustomSslBundleRegistry(
    sslBundleRegistrars: ObjectProvider<SslBundleRegistrar>
) : SslBundleRegistry, SslBundles {

    private val registeredBundles: MutableMap<String, RegisteredSslBundle> = ConcurrentHashMap()

    companion object {
        private val logger: Log = LogFactory.getLog(CustomSslBundleRegistry::class.java)
    }

    init {
        sslBundleRegistrars.orderedStream().forEach { registrar ->
            registrar.registerBundles(this)
        }
    }


    final override fun registerBundle(name: String, bundle: SslBundle) {
        val previous = registeredBundles.putIfAbsent(name, RegisteredSslBundle(name, bundle))
        require(previous == null) { "Cannot replace existing SSL bundle '${name}'" }
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

    override fun getBundleNames(): List<String?>? {
        val names = ArrayList(this.registeredBundles.keys)
        names.sort()
        return Collections.unmodifiableList(names)
    }

    @Throws(NoSuchSslBundleException::class)
    private fun getRegistered(name: String): RegisteredSslBundle {
        val registered = registeredBundles[name] ?: throw NoSuchSslBundleException(
            name,
            "SSL bundle name '${name}' cannot be found"
        )
        return registered
    }

    private class RegisteredSslBundle(private val name: String, @field:Volatile var bundle: SslBundle) {
        private val updateHandlers: MutableList<Consumer<SslBundle>> = CopyOnWriteArrayList()

        fun update(updatedBundle: SslBundle) {
            this.bundle = updatedBundle
            if (updateHandlers.isEmpty()) {
                logger.warn(
                    "SSL bundle '${this.name}' has been updated but may be in use by a technology that doesn't support SSL reloading"
                )
            }
            updateHandlers.forEach(Consumer { handler: Consumer<SslBundle> -> handler.accept(updatedBundle) })
        }

        fun addUpdateHandler(updateHandler: Consumer<SslBundle>) {
            updateHandlers.add(updateHandler)
        }
    }

}

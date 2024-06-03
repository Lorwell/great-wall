package cc.shacocloud.greatwall.utils

import org.jetbrains.annotations.Contract
import java.io.File
import java.io.IOException
import java.net.JarURLConnection
import java.net.URISyntaxException
import java.net.URL
import java.security.CodeSource
import java.util.*
import java.util.jar.JarFile

/**
 * 应用工具库
 *
 * @author 思追(shaco)
 */
@Slf4j
object AppUtil {

    /**
     * 获取应用启动文件目录
     */
    fun getStartDir(sourceClass: Class<*>?): File {
        var homeDir = findSource(sourceClass)
        homeDir = if ((homeDir != null)) homeDir else getHomeDir()
        if (homeDir.isFile) {
            homeDir = homeDir.parentFile
        }
        homeDir = if (homeDir!!.exists()) homeDir else File(".")
        return homeDir.absoluteFile
    }

    /**
     * 返回用于查找主目录的基础源。这通常是 jar 文件或目录。如果无法确定源，则返回 null
     */
    fun findSource(sourceClass: Class<*>?): File? {
        if (Objects.isNull(sourceClass)) return null

        try {
            val domain = sourceClass!!.protectionDomain
            val codeSource: CodeSource? = if ((domain != null)) domain.codeSource else null
            val location: URL? = if ((codeSource != null)) codeSource.getLocation() else null
            val source = if ((location != null)) findSource(location) else null
            if (source != null && source.exists() && !isUnitTest()) {
                return source.absoluteFile
            }
        } catch (ignore: Exception) {
        }
        return null
    }

    /**
     * 获取用户默认目录
     */
    fun getHomeDir(): File {
        val userDir = System.getProperty("user.dir")
        return File(userDir.ifEmpty { "." })
    }

    @Throws(IOException::class, URISyntaxException::class)
    private fun findSource(location: URL): File {
        val connection = location.openConnection()
        if (connection is JarURLConnection) {
            return getRootJarFile(connection.jarFile)
        }
        return File(location.toURI())
    }

    @Contract("_ -> new")
    private fun getRootJarFile(jarFile: JarFile): File {
        var name = jarFile.name
        val separator = name.indexOf("!/")
        if (separator > 0) {
            name = name.substring(0, separator)
        }
        return File(name)
    }

    /**
     * 是否是单元测试，如果是返回 true 反之 false
     */
    fun isUnitTest(): Boolean {
        try {
            val stackTrace = Thread.currentThread().stackTrace
            for (i in stackTrace.indices.reversed()) {
                if (stackTrace[i].className.startsWith("org.junit.")) {
                    return true
                }
            }
        } catch (ignore: java.lang.Exception) {
        }
        return false
    }
}

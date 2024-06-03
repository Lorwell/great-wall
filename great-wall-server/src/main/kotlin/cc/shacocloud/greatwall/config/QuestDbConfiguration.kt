package cc.shacocloud.greatwall.config

import cc.shacocloud.greatwall.utils.AppUtil
import cc.shacocloud.greatwall.utils.ScriptUtils
import io.questdb.ServerMain
import io.questdb.cairo.CairoEngine
import io.questdb.cairo.DefaultCairoConfiguration
import io.questdb.cairo.security.AllowAllSecurityContext
import io.questdb.griffin.SqlExecutionContextImpl
import org.springframework.beans.factory.ObjectProvider
import org.springframework.boot.context.event.ApplicationReadyEvent
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.event.EventListener
import org.springframework.core.Ordered
import org.springframework.core.annotation.Order
import org.springframework.core.io.support.EncodedResource
import org.springframework.core.io.support.ResourcePatternUtils
import java.io.FileNotFoundException
import java.nio.file.Files
import java.nio.file.Paths
import kotlin.io.path.absolutePathString


/**
 *
 * @author 思追(shaco)
 * @see [https://questdb.io/docs/reference/api/java-embedded/]
 */
@Configuration
class QuestDbConfiguration {

    // 项目根路径
    val root: String
        get() {
            val startDir = AppUtil.getStartDir(QuestDbConfiguration::class.java)
            val rootPath = Paths.get(startDir.absolutePath, "data", "questDb").normalize()
            Files.createDirectories(rootPath)
            return rootPath.absolutePathString()
        }

    /**
     * 本地结构文件路径模式
     */
    val locationSchemaPattern: String
        get() = "classpath*:sql/schema.questdb.sql"

    /**
     * QuestDb 引擎
     */
    @Bean(destroyMethod = "close")
    fun cairoEngine(serverMainProvider: ObjectProvider<ServerMain>): CairoEngine {
        val serverMain = serverMainProvider.ifAvailable

        return serverMain?.engine ?: let {
            val configuration = DefaultCairoConfiguration(root)
            CairoEngine(configuration)
        }
    }

    /**
     * QuestDb 引擎
     */
    @Bean(destroyMethod = "close")
    fun serverMain(): ServerMain {
        val serverMain = ServerMain.create(root)
        return serverMain
    }

    /**
     * 初始化 schema
     */
    @EventListener(ApplicationReadyEvent::class)
    fun initSchema(event: ApplicationReadyEvent) {
        val applicationContext = event.applicationContext

        val resourcePatternResolver = ResourcePatternUtils.getResourcePatternResolver(applicationContext)
        val resources = resourcePatternResolver.getResources(locationSchemaPattern)
            .filter { it.isReadable }

        if (resources.isEmpty()) {
            throw FileNotFoundException("$locationSchemaPattern 未能匹配到任何 schema 文件!")
        }

        val cairoEngine = applicationContext.getBean(CairoEngine::class.java)
        val ctx = SqlExecutionContextImpl(cairoEngine, 1)
            .with(AllowAllSecurityContext.INSTANCE, null)

        resources.forEach { resource ->
            val scripts = ScriptUtils.splitSqlScript(EncodedResource(resource, Charsets.UTF_8))
            scripts.forEach { script ->
                cairoEngine.ddl(script, ctx)
            }
        }
    }

    /**
     * 应用启动后启动 questdb web 服务
     */
    @Order(Ordered.LOWEST_PRECEDENCE)
    @EventListener(ApplicationReadyEvent::class)
    fun startServer(event: ApplicationReadyEvent) {
        val serverMain = event.applicationContext.getBean(ServerMain::class.java)
        serverMain.start()
    }

}
package cc.shacocloud.greatwall.config

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.mo.RoutePredicates
import cc.shacocloud.greatwall.model.mo.RouteUrls
import cc.shacocloud.greatwall.model.po.converter.*
import cc.shacocloud.greatwall.utils.AppUtil
import io.r2dbc.h2.H2ConnectionConfiguration
import io.r2dbc.h2.H2ConnectionFactory
import io.r2dbc.pool.ConnectionPool
import io.r2dbc.pool.ConnectionPoolConfiguration
import io.r2dbc.spi.ConnectionFactory
import io.r2dbc.spi.Parameters
import org.springframework.boot.autoconfigure.r2dbc.R2dbcProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.r2dbc.config.AbstractR2dbcConfiguration
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories
import org.springframework.r2dbc.connection.R2dbcTransactionManager
import org.springframework.r2dbc.core.DatabaseClient
import org.springframework.transaction.ReactiveTransactionManager
import org.springframework.transaction.reactive.TransactionalOperator
import java.io.File
import java.nio.file.Paths
import kotlin.io.path.absolutePathString


/**
 *
 * @see [https://docs.spring.io/spring-data/relational/reference/r2dbc/getting-started.html#r2dbc.connectionfactory]
 * @author 思追(shaco)
 */
@Configuration
@EnableR2dbcRepositories
class R2dbcConfiguration(
    val r2dbcProperties: R2dbcProperties
) : AbstractR2dbcConfiguration() {

    companion object {
        const val FILE_PROTOCOL = "file:"

        inline fun <reified T : Any> DatabaseClient.GenericExecuteSpec.bindByIndex(index: Int, value: T?) =
            bind(index, if (value != null) Parameters.`in`(value) else Parameters.`in`(T::class.java))

        inline fun <reified T : Any> DatabaseClient.GenericExecuteSpec.bindByName(name: String, value: T?) =
            bind(name, if (value != null) Parameters.`in`(value) else Parameters.`in`(T::class.java))
    }

    @Bean(destroyMethod = "dispose")
    override fun connectionFactory(): ConnectionPool {

        val builder = H2ConnectionConfiguration.builder()
        builder.url(urlFileProtocolAbsolutePath(r2dbcProperties.url))
            .username(r2dbcProperties.username)
            .password(r2dbcProperties.password)
        r2dbcProperties.properties.forEach { (t, u) -> builder.property(t, u) }
        val connectionFactory = H2ConnectionFactory(builder.build())

        val poolBuilder = ConnectionPoolConfiguration.builder(connectionFactory)
        val pool = r2dbcProperties.pool
        pool.maxIdleTime?.let { poolBuilder.maxIdleTime(it) }
        pool.maxLifeTime?.let { poolBuilder.maxLifeTime(it) }
        pool.maxAcquireTime?.let { poolBuilder.maxAcquireTime(it) }
        pool.maxCreateConnectionTime?.let { poolBuilder.maxCreateConnectionTime(it) }
        pool.initialSize.let { poolBuilder.initialSize(it) }
        pool.maxSize.let { poolBuilder.maxSize(it) }
        pool.validationQuery?.let { poolBuilder.validationQuery(it) }
        pool.validationDepth?.let { poolBuilder.validationDepth(it) }
        pool.minIdle.let { poolBuilder.minIdle(it) }
        pool.maxValidationTime?.let { poolBuilder.maxValidationTime(it) }

        return ConnectionPool(poolBuilder.build())
    }

    /**
     * 事务管理器
     */
    @Bean
    fun transactionManager(connectionFactory: ConnectionFactory): ReactiveTransactionManager {
        return R2dbcTransactionManager(connectionFactory)
    }

    @Bean
    fun transactionalOperator(transactionManager: ReactiveTransactionManager): TransactionalOperator {
        return TransactionalOperator.create(transactionManager)
    }

    /**
     * r2dbc属性 自定义转换器
     */
    override fun getCustomConverters(): MutableList<Any> {
        return mutableListOf(
            DateToLongConverter(),
            LongToDateConverter(),
            object : BeanToJsonStringConverter<RoutePredicates>() {},
            object : JsonStringToBeanConverter<RoutePredicates>() {},
            object : BeanToJsonStringConverter<RouteUrls>() {},
            object : JsonStringToBeanConverter<RouteUrls>() {},
            object : EnumToStringConverter<AppRouteStatusEnum>() {},
            object : StringToEnumConverter<AppRouteStatusEnum>() {}
        )
    }


    /**
     * 将指定本地文件的h2地址转为绝对路径
     */
    fun urlFileProtocolAbsolutePath(url: String): String {
        if (url.startsWith(FILE_PROTOCOL, ignoreCase = true)) {
            val containsProperty = url.contains(";")
            val path = url.substring(FILE_PROTOCOL.length, if (containsProperty) url.indexOf(";") else url.length)
            if (!File(path).isAbsolute) {
                val startDir = AppUtil.getStartDir(R2dbcConfiguration::class.java)
                val absolutePath = Paths.get(startDir.absolutePath, path).normalize().absolutePathString()
                val property = if (containsProperty) ";${url.substringAfter(";")}" else ""
                return "file:${absolutePath}${property}"
            }
        }
        return url
    }

}
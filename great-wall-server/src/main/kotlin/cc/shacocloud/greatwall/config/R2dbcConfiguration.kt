package cc.shacocloud.greatwall.config

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.po.AppRoutePo.RoutePredicates
import cc.shacocloud.greatwall.model.po.CookiesParamsMetrics
import cc.shacocloud.greatwall.model.po.QueryParamsMetrics
import cc.shacocloud.greatwall.model.po.converter.BeanToJsonStringConverter
import cc.shacocloud.greatwall.model.po.converter.EnumToStringConverter
import cc.shacocloud.greatwall.model.po.converter.JsonStringToBeanConverter
import cc.shacocloud.greatwall.model.po.converter.StringToEnumConverter
import io.r2dbc.h2.H2ConnectionConfiguration
import io.r2dbc.h2.H2ConnectionFactory
import io.r2dbc.pool.ConnectionPool
import io.r2dbc.pool.ConnectionPoolConfiguration
import io.r2dbc.spi.ConnectionFactory
import org.springframework.boot.autoconfigure.r2dbc.R2dbcProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.r2dbc.config.AbstractR2dbcConfiguration
import org.springframework.data.r2dbc.repository.config.EnableR2dbcRepositories
import org.springframework.r2dbc.connection.R2dbcTransactionManager
import org.springframework.transaction.ReactiveTransactionManager


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

    @Bean(destroyMethod = "dispose")
    override fun connectionFactory(): ConnectionPool {

        val builder = H2ConnectionConfiguration.builder()

        builder.url(r2dbcProperties.url)
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

    /**
     * r2dbc属性 自定义转换器
     */
    override fun getCustomConverters(): MutableList<Any> {
        return mutableListOf(
            object : BeanToJsonStringConverter<QueryParamsMetrics>() {},
            object : JsonStringToBeanConverter<QueryParamsMetrics>() {},
            object : BeanToJsonStringConverter<CookiesParamsMetrics>() {},
            object : JsonStringToBeanConverter<CookiesParamsMetrics>() {},
            object : BeanToJsonStringConverter<RoutePredicates>() {},
            object : JsonStringToBeanConverter<RoutePredicates>() {},
            object : EnumToStringConverter<AppRouteStatusEnum>() {},
            object : StringToEnumConverter<AppRouteStatusEnum>() {},
        )
    }


}
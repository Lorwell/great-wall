package cc.shacocloud.greatwall.config

import io.r2dbc.h2.H2ConnectionConfiguration
import io.r2dbc.h2.H2ConnectionFactory
import io.r2dbc.spi.ConnectionFactory
import org.springframework.boot.autoconfigure.r2dbc.R2dbcProperties
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.data.r2dbc.config.AbstractR2dbcConfiguration

/**
 *
 * @see [https://docs.spring.io/spring-data/relational/reference/r2dbc/getting-started.html#r2dbc.connectionfactory]
 * @author 思追(shaco)
 */
@Configuration
class R2dbcConfiguration(
    val r2dbcProperties: R2dbcProperties
) : AbstractR2dbcConfiguration() {

    @Bean
    override fun connectionFactory(): ConnectionFactory {

        val builder = H2ConnectionConfiguration.builder()

        builder.url(r2dbcProperties.url)
            .username(r2dbcProperties.username)
            .password(r2dbcProperties.password)
        r2dbcProperties.properties.forEach { (t, u) -> builder.property(t, u) }

        return H2ConnectionFactory(builder.build())
    }

}
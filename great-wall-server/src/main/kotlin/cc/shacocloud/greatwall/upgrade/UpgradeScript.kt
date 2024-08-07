package cc.shacocloud.greatwall.upgrade

import io.r2dbc.spi.Readable
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.runBlocking
import org.springframework.beans.factory.InitializingBean
import org.springframework.r2dbc.core.DatabaseClient
import org.springframework.r2dbc.core.await
import org.springframework.r2dbc.core.awaitSingle
import org.springframework.stereotype.Component

/**
 * 升级脚本
 * @author 思追(shaco)
 */
@Component
class UpgradeScript(
    val databaseClient: DatabaseClient,
) : InitializingBean {

    override fun afterPropertiesSet() {
        runBlocking {
            upRouteMetricsRecord()
            addAppRouteFilterField()
        }
    }

    suspend fun addAppRouteFilterField() {
        databaseClient.sql("show tables")
            .map { readable: Readable -> readable.get(0) as String }
            .all()
            .collectList()
            .awaitSingle()
            .map { it.lowercase() }
            .find { it.startsWith("app_route") }
            ?: return

        // 判断是否存在指定列
        val exits = databaseClient.sql(
            """
                     select count(1) from INFORMATION_SCHEMA.COLUMNS
                     where TABLE_NAME = 'APP_ROUTE' AND COLUMN_NAME = 'FILTERS';
                    """.trimIndent()
        )
            .map { readable: Readable -> ((readable.get(0) as Number?)?.toInt() ?: 0) > 0 }
            .awaitSingle()

        // 不存在则新增
        if (!exits) {
            databaseClient.sql("alter table APP_ROUTE add filters longtext default '[]' not null")
                .await()
        }
    }

    /**
     * 升级路由指标相关记录表
     */
    suspend fun upRouteMetricsRecord() {
        databaseClient.sql("show tables")
            .map { readable: Readable -> readable.get(0) as String }
            .all()
            .collectList()
            .awaitSingle()
            .map { it.lowercase() }
            .filter { it.startsWith("route_metrics_record_") }
            .forEach {

                // 判断是否存在指定列
                val exits = databaseClient.sql(
                    """
                     select count(1) from INFORMATION_SCHEMA.COLUMNS
                     where TABLE_NAME = '${it.uppercase()}' AND COLUMN_NAME = 'APP_ROUTE_ID';
                    """.trimIndent()
                )
                    .map { readable: Readable -> ((readable.get(0) as Number?)?.toInt() ?: 0) > 0 }
                    .awaitSingle()

                // 不存在则新增
                if (!exits) {
                    databaseClient.sql("alter table $it add column app_route_id BIGINT NULL")
                        .await()
                }
            }
    }

}
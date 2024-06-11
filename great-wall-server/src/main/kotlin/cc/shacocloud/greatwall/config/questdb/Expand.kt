package cc.shacocloud.greatwall.config.questdb

import io.questdb.cairo.CairoEngine
import io.questdb.cairo.security.AllowAllSecurityContext
import io.questdb.cairo.sql.Record
import io.questdb.cairo.sql.RecordCursor
import io.questdb.griffin.SqlExecutionContextImpl
import kotlinx.coroutines.asCoroutineDispatcher
import kotlinx.coroutines.withContext
import java.util.concurrent.Executors
import kotlin.coroutines.CoroutineContext

/**
 *  quest db 数据写入调度器
 */
val QUESTDB_WRITE_DISPATCHER = Executors.newFixedThreadPool(1)
    .asCoroutineDispatcher()

/**
 * quest db 查询调度器
 */
val QUESTDB_METRICS_QUERY_DISPATCHER = Executors.newFixedThreadPool(2)
    .asCoroutineDispatcher()

/**
 * 查询结果
 */
suspend fun <T> CairoEngine.find(
    querySql: String,
    context: CoroutineContext = QUESTDB_METRICS_QUERY_DISPATCHER,
    handler: suspend (RecordCursor) -> T
): T {
    val self = this
    return withContext(context) {
        SqlExecutionContextImpl(self, 1).with(AllowAllSecurityContext.INSTANCE, null).use { ctx ->
            select(querySql, ctx).use { factory ->
                factory.getCursor(ctx).use { cursor -> handler(cursor) }
            }
        }
    }
}

/**
 * 查询一行结果
 */
suspend fun <T> CairoEngine.findOne(
    querySql: String,
    context: CoroutineContext = QUESTDB_METRICS_QUERY_DISPATCHER,
    handler: suspend (Record) -> T
): T? {
    return find(querySql, context) { cursor ->
        val size = cursor.size()
        if (size > 0) {
            require(size == 1.toLong()) { "期望返回1条结果，实际返回 $size 条！" }
            cursor.hasNext()
            handler(cursor.record)
        } else null
    }
}


/**
 * 查询一行结果
 */
suspend fun <T> CairoEngine.findOneNotNull(
    querySql: String,
    context: CoroutineContext = QUESTDB_METRICS_QUERY_DISPATCHER,
    handler: suspend (Record) -> T
): T {
    return find(querySql, context) { cursor ->
        val size = cursor.size()
        require(size == 1.toLong()) { "期望返回1条结果，实际返回 $size 条！" }
        cursor.hasNext()
        handler(cursor.record)
    }
}

/**
 * 查询多行结果
 */
suspend fun <T> CairoEngine.findAll(
    querySql: String,
    context: CoroutineContext = QUESTDB_METRICS_QUERY_DISPATCHER,
    handler: suspend (Record) -> T
): List<T> {
    return find(querySql, context) { cursor ->
        val result = ArrayList<T>()

        while (cursor.hasNext()) {
            result.add(handler(cursor.record))
        }

        result
    }
}

package cc.shacocloud.greatwall.service.cache

import kotlinx.serialization.DeserializationStrategy
import kotlinx.serialization.SerializationStrategy
import java.util.function.Supplier
import kotlin.time.Duration

/**
 * 缓存的顶层接口
 *
 * @author 思追(shaco)
 */
interface Cache {

    /**
     * 缓存名称
     */
    suspend fun name(): String


    /**
     * 根据指定的缓存键获取缓存数据
     *
     * @param key      缓存的键
     */
    suspend fun <T : Any> get(
        key: String,
        deserializer: DeserializationStrategy<T>
    ): T?

    /**
     * 根据指定的缓存键获取缓存数据
     *
     * @param key      缓存的键
     * @param supplier 当键不存在时使用该值返回
     */
    suspend fun <T : Any> get(
        key: String,
        deserializer: DeserializationStrategy<T>,
        supplier: Supplier<T>
    ): T {
        return get(key, deserializer) ?: supplier.get()
    }

    /**
     * 将指定的值写入指定的键中
     *
     * @param key     缓存的键
     * @param value   缓存的值
     * @param ttl     过期时间
     */
    suspend fun <T : Any> put(key: String, serializer: SerializationStrategy<T>, value: T, ttl: Duration): T

    /**
     * 根据指定的缓存键删除缓存数据
     *
     * @param key 缓存的键
     */
    suspend fun del(key: String)

}

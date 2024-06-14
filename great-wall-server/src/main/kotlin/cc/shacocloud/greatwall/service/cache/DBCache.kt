package cc.shacocloud.greatwall.service.cache

import cc.shacocloud.greatwall.model.po.CachePo
import cc.shacocloud.greatwall.repository.CacheRepository
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.serialization.DeserializationStrategy
import kotlinx.serialization.SerializationStrategy
import kotlinx.serialization.json.Json
import java.util.*
import kotlin.time.Duration
import kotlin.time.DurationUnit

/**
 * 基于 数据库 的缓存实现
 *
 * @author 思追(shaco)
 */
class DBCache(

    /**
     * 缓存名称
     */
    private val name: String,

    /**
     * 缓存存储库
     */
    private val cacheRepository: CacheRepository

) : Cache {

    override suspend fun name(): String {
        return name
    }

    /**
     * 根据指定的缓存键获取缓存数据
     *
     * @param key      缓存的键
     */
    override suspend fun <T : Any> get(
        key: String,
        deserializer: DeserializationStrategy<T>
    ): T? {
        val cachePo = cacheRepository.findByNameAndCacheKey(name, key).awaitSingleOrNull()
        return cachePo?.let { getCacheValue(it, deserializer) }
    }

    override suspend fun <T : Any> put(
        key: String,
        serializer: SerializationStrategy<T>,
        value: T,
        ttl: Duration
    ): T {
        val expirationTime = Date().time + ttl.toLong(DurationUnit.MILLISECONDS)
        val strValue = Json.encodeToString(serializer, value)
        val cachePo = (cacheRepository.findByNameAndCacheKey(name, key).awaitSingleOrNull()
            ?.let {
                it.cacheValue = strValue
                it.expirationTime = expirationTime
                it
            }
            ?: CachePo(name = name, cacheKey = key, cacheValue = strValue, expirationTime = expirationTime))

        cacheRepository.save(cachePo).awaitSingle()

        return value
    }

    override suspend fun del(key: String) {
        cacheRepository.deleteByNameAndCacheKey(name, key).awaitSingleOrNull()
    }

    /**
     * 获取缓存值，如果过期则返回 null
     */
    private fun <T : Any> getCacheValue(cachePo: CachePo, serializer: DeserializationStrategy<T>): T? {
        return if (cachePo.expirationTime >= Date().time) {
            Json.decodeFromString(serializer, cachePo.cacheValue)
        } else null
    }
}

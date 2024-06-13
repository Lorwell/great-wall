package cc.shacocloud.greatwall.service.cache

import cc.shacocloud.greatwall.model.po.CachePo
import cc.shacocloud.greatwall.repository.CacheRepository
import kotlinx.coroutines.reactor.awaitSingle
import kotlinx.coroutines.reactor.awaitSingleOrNull
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
    override suspend fun <T> get(key: String): T? {
        val cachePo = cacheRepository.findByNameAndCacheKey(name, key).awaitSingleOrNull()
        return cachePo?.let { getCacheValue<T>(it) }
    }

    override suspend fun <T> put(key: String, value: T, ttl: Duration): T {
        val expirationTime = Date().time + ttl.toLong(DurationUnit.MILLISECONDS)
        val cachePo = (cacheRepository.findByNameAndCacheKey(name, key).awaitSingleOrNull()
            ?.let {
                it.cacheValue = value
                it.expirationTime = expirationTime
                it
            }
            ?: CachePo(name = name, cacheKey = key, cacheValue = value, expirationTime = expirationTime))

        cacheRepository.save(cachePo).awaitSingle()

        return value
    }

    override suspend fun del(key: String) {
        cacheRepository.deleteByNameAndCacheKey(name, key).awaitSingleOrNull()
    }

    /**
     * 获取缓存值，如果过期则返回 null
     */
    @Suppress("UNCHECKED_CAST")
    private fun <T> getCacheValue(cachePo: CachePo): T? {
        return if (cachePo.expirationTime >= Date().time) cachePo.cacheValue as T? else null
    }
}
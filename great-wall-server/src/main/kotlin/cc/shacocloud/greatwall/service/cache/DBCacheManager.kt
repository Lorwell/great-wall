package cc.shacocloud.greatwall.service.cache

import cc.shacocloud.greatwall.repository.CacheRepository
import kotlinx.coroutines.reactor.awaitSingleOrNull
import org.springframework.scheduling.annotation.Scheduled
import java.util.*
import java.util.concurrent.TimeUnit

/**
 * 基于数据库实现得缓存管理器
 * @author 思追(shaco)
 */
class DBCacheManager(
    private val cacheRepository: CacheRepository
) : CacheManager {

    /**
     * 根据缓存名称获取缓存对象
     *
     * @param name 缓存名称
     */
    override fun getCache(name: String): Cache {
        return DBCache(name, cacheRepository)
    }

    /**
     * 每分钟清理一次过期数据
     */
    @Scheduled(fixedDelay = 1, timeUnit = TimeUnit.MINUTES)
    suspend fun clearExpirationData() {
        cacheRepository.deleteByExpirationTimeLessThan(Date().time).awaitSingleOrNull()
    }

}
package cc.shacocloud.greatwall.repository

import cc.shacocloud.greatwall.model.po.CachePo
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Mono

/**
 *
 * @author 思追(shaco)
 */
@Repository
@Transactional
interface CacheRepository : R2dbcRepository<CachePo> {

    fun findByNameAndCacheKey(name: String, cacheKey: String): Mono<CachePo>

    fun deleteByNameAndCacheKey(name: String, cacheKey: String): Mono<Unit>

    fun deleteByExpirationTimeLessThan(expirationTime: Long): Mono<Unit>

}
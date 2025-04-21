package cc.shacocloud.greatwall.repository

import cc.shacocloud.greatwall.model.po.TlsPo
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Mono

/**
 *
 * @author 思追(shaco)
 */
@Repository
@Transactional
interface TlsRepository : R2dbcRepository<TlsPo> {

    /**
     * 根据指定 key 查询
     */
    fun findByKey(key: String): Mono<TlsPo>

}
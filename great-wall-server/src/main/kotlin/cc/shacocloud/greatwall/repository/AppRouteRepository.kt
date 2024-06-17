package cc.shacocloud.greatwall.repository

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.po.AppRoutePo
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Flux
import reactor.core.publisher.Mono

/**
 *
 * @author 思追(shaco)
 */
@Repository
@Transactional
interface AppRouteRepository : R2dbcRepository<AppRoutePo, Long> {

    /**
     * 根据状态查询列表
     */
    fun findByStatus(status: AppRouteStatusEnum): Flux<AppRoutePo>

    /**
     * 根据名称和描述统计
     */
    fun countByNameOrDescribe(name: String, describe: String): Mono<Long>

    /**
     * 根据名称和描述分页查询
     */
    fun findAllByNameOrDescribe(keyword: Any, keyword1: Any, pageable: Pageable): Flux<AppRoutePo>

}
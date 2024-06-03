package cc.shacocloud.greatwall.repository

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.po.AppRoutePo
import com.infobip.spring.data.r2dbc.QuerydslR2dbcRepository
import com.querydsl.core.types.Predicate
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Repository
import org.springframework.transaction.annotation.Transactional
import reactor.core.publisher.Flux

/**
 *
 * @author 思追(shaco)
 */
@Repository
@Transactional
interface AppRouteRepository : QuerydslR2dbcRepository<AppRoutePo, Long> {

    /**
     * 根据状态查询列表
     */
    fun findByStatus(status: AppRouteStatusEnum): Flux<AppRoutePo>

    fun findAllBy(predicate: Predicate, pageable: Pageable): Flux<AppRoutePo>

}
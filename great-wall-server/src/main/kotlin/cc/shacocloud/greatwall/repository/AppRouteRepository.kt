package cc.shacocloud.greatwall.repository

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.po.AppRoutePo
import org.springframework.data.repository.kotlin.CoroutineCrudRepository

/**
 *
 * @author 思追(shaco)
 */
interface AppRouteRepository : CoroutineCrudRepository<AppRoutePo, Long> {

    /**
     * 根据状态查询列表
     */
    suspend fun findByStatus(status: AppRouteStatusEnum): List<AppRoutePo>

}
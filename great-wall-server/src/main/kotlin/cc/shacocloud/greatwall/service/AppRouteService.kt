package cc.shacocloud.greatwall.service

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.dto.input.AppRouteInput
import cc.shacocloud.greatwall.model.dto.input.AppRouteListInput
import cc.shacocloud.greatwall.model.po.AppRoutePo
import org.springframework.data.domain.Page

/**
 *
 * @author 思追(shaco)
 */
interface AppRouteService {

    /**
     * 创建路由
     */
    suspend fun create(input: AppRouteInput): AppRoutePo

    /**
     * 根据状态查询列表
     */
    suspend fun findByStatus(status: AppRouteStatusEnum): List<AppRoutePo>

    /**
     * 列表查询
     */
    suspend fun list(input: AppRouteListInput): Page<AppRoutePo>

}
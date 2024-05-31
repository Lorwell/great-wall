package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.dto.input.AppRouteInput
import cc.shacocloud.greatwall.model.po.AppRoutePo
import cc.shacocloud.greatwall.repository.AppRouteRepository
import cc.shacocloud.greatwall.service.AppRouteService
import cc.shacocloud.greatwall.utils.Slf4j
import org.springframework.stereotype.Service
import java.util.*

/**
 *
 * @author 思追(shaco)
 */
@Slf4j
@Service
class AppRouteServiceImpl(
    val appRouteRepository: AppRouteRepository,
) : AppRouteService {

    /**
     * 创建路由
     */
    override suspend fun create(input: AppRouteInput): AppRoutePo {
        val appRoutePo = AppRoutePo(
            name = input.name,
            describe = input.describe,
            priority = input.priority,
            status = input.status,
            urls = input.urls,
            predicates = input.predicates,
            createTime = Date(),
            lastUpdateTime = Date()
        )

        return appRouteRepository.save(appRoutePo)
    }

    /**
     * 根据状态查询列表
     */
    override suspend fun findByStatus(status: AppRouteStatusEnum): List<AppRoutePo> {
        return appRouteRepository.findByStatus(status)
    }

}
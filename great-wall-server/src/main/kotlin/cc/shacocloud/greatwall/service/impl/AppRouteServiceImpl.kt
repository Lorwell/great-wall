package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.dto.input.AppRouteInput
import cc.shacocloud.greatwall.model.dto.input.AppRouteListInput
import cc.shacocloud.greatwall.model.po.AppRoutePo
import cc.shacocloud.greatwall.repository.AppRouteRepository
import cc.shacocloud.greatwall.service.AppRouteService
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.r2dbc.core.DatabaseClient
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

/**
 *
 * @author 思追(shaco)
 */
@Service
@Transactional(rollbackFor = [Exception::class])
class AppRouteServiceImpl(
    val appRouteRepository: AppRouteRepository,
    val databaseClient: DatabaseClient
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
            targetConfig = input.targetConfig,
            predicates = input.predicates,
            createTime = Date(),
            lastUpdateTime = Date()
        )

        return appRouteRepository.save(appRoutePo).awaitSingle()
    }

    /**
     * 根据状态查询列表
     */
    override suspend fun findByStatus(status: AppRouteStatusEnum): List<AppRoutePo> {
        return appRouteRepository.findByStatus(status).collectList().awaitSingle()
    }

    /**
     * 列表查询
     */
    override suspend fun list(input: AppRouteListInput): Page<AppRoutePo> {

        val keyword = input.keyword

        val total =
            if (keyword.isNullOrBlank()) {
                appRouteRepository.count().awaitSingle()
            } else {
                appRouteRepository.countByNameOrDescribe(keyword, keyword).awaitSingle()
            }

        val pageable = input.toPageable()
        if (total == 0.toLong()) {
            return PageImpl(emptyList(), pageable, total)
        }

        val contents =
            if (keyword.isNullOrBlank()) {
                appRouteRepository.findAllBy(pageable).collectList().awaitSingle()
            } else {
                appRouteRepository.findAllByNameOrDescribe(keyword, keyword, pageable).collectList().awaitSingle()
            }

        return PageImpl(contents, pageable, total)
    }

    /**
     * 根据id查询
     */
    override suspend fun findById(id: Long): AppRoutePo? {
        return appRouteRepository.findById(id).awaitSingle()
    }

    /**
     * 更新路由
     */
    override suspend fun update(appRoutePo: AppRoutePo, input: AppRouteInput): AppRoutePo {
        appRoutePo.apply {
            name = input.name
            describe = input.describe
            priority = input.priority
            status = input.status
            targetConfig = input.targetConfig
            predicates = input.predicates
            lastUpdateTime = Date()
        }

        return appRouteRepository.save(appRoutePo).awaitSingle()
    }

    /**
     * 设置应用路由状态
     */
    override suspend fun setStatus(appRoutePo: AppRoutePo, status: AppRouteStatusEnum): AppRoutePo {
        appRoutePo.status = status
        return appRouteRepository.save(appRoutePo).awaitSingle()
    }

}
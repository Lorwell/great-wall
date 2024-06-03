package cc.shacocloud.greatwall.service.impl

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.dto.input.AppRouteInput
import cc.shacocloud.greatwall.model.dto.input.AppRouteListInput
import cc.shacocloud.greatwall.model.po.AppRoutePo
import cc.shacocloud.greatwall.model.po.QAppRoutePo
import cc.shacocloud.greatwall.repository.AppRouteRepository
import cc.shacocloud.greatwall.service.AppRouteService
import cc.shacocloud.greatwall.utils.Slf4j
import kotlinx.coroutines.reactor.awaitSingle
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.util.*

/**
 *
 * @author 思追(shaco)
 */
@Slf4j
@Service
@Transactional(rollbackFor = [Exception::class])
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
        val pageable = input.toPageable()

        val qAppRoutePo = QAppRoutePo.appRoutePo
        val predicate = input.likeKeyWordOr(qAppRoutePo.name, qAppRoutePo.describe)

        val total = appRouteRepository.count(predicate).awaitSingle()
        val contents = appRouteRepository.findAllBy(predicate, pageable).collectList().awaitSingle()
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
            urls = input.urls
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
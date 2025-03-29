package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.controller.exception.NotAcceptableException
import cc.shacocloud.greatwall.controller.exception.NotFoundException
import cc.shacocloud.greatwall.controller.interceptor.UserAuth
import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.dto.input.AppRouteInput
import cc.shacocloud.greatwall.model.dto.input.AppRouteListInput
import cc.shacocloud.greatwall.model.dto.input.BatchDeleteInput
import cc.shacocloud.greatwall.model.dto.output.AppRouteOutput
import cc.shacocloud.greatwall.model.dto.output.AppRouteOutput.Companion.toOutput
import cc.shacocloud.greatwall.model.mo.RouteStaticResourcesTargetConfig
import cc.shacocloud.greatwall.service.AppRouteLocator
import cc.shacocloud.greatwall.service.AppRouteService
import cc.shacocloud.greatwall.service.StaticResourcesService
import org.springframework.data.domain.Page
import org.springframework.transaction.annotation.Transactional
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

/**
 *
 * @author 思追(shaco)
 */
@UserAuth
@Validated
@RestController
@RequestMapping("/api/app-route")
@Transactional(rollbackFor = [Exception::class])
class AppRouteController(
    val appRouteService: AppRouteService,
    val staticResourcesService: StaticResourcesService
) {

    /**
     * 创建应用路由
     */
    @PostMapping
    suspend fun create(@RequestBody @Validated input: AppRouteInput): AppRouteOutput {
        val appRoutePo = appRouteService.create(input)

        // 刷新路由
        AppRouteLocator.refreshRoutes()
        return appRoutePo.toOutput()
    }

    /**
     * 应用路由列表
     */
    @PostMapping("/list")
    suspend fun list(@RequestBody @Validated input: AppRouteListInput): Page<AppRouteOutput> {
        return appRouteService.list(input)
            .map { it.toOutput() }
    }

    /**
     * 应用路由详情
     */
    @GetMapping("/{id}")
    suspend fun details(@PathVariable id: Long): AppRouteOutput {
        val appRoutePo = appRouteService.findById(id) ?: throw NotFoundException()
        return appRoutePo.toOutput()
    }

    /**
     * 更新应用路由
     */
    @PutMapping("/{id}")
    suspend fun update(
        @PathVariable id: Long,
        @RequestBody @Validated input: AppRouteInput
    ): AppRouteOutput {
        var appRoutePo = appRouteService.findById(id) ?: throw NotFoundException()
        appRoutePo = appRouteService.update(appRoutePo, input)

        // 刷新路由
        AppRouteLocator.refreshRoutes()
        return appRoutePo.toOutput()
    }

    /**
     * 更新应用路由状态
     */
    @PatchMapping("/{id}/status/{status}")
    suspend fun setStatus(
        @PathVariable id: Long,
        @PathVariable status: AppRouteStatusEnum,
    ): AppRouteOutput {
        var appRoutePo = appRouteService.findById(id) ?: throw NotFoundException()

        // 静态资源必须存在
        val targetConfig = appRoutePo.targetConfig
        if (AppRouteStatusEnum.ONLINE == status
            && targetConfig is RouteStaticResourcesTargetConfig
        ) {
            val staticResourcesPo = staticResourcesService.findById(targetConfig.id)
            if (staticResourcesPo == null) {
                throw NotAcceptableException("路由关联的静态资源不存在或者已经被删除！")
            }
        }

        appRoutePo = appRouteService.setStatus(appRoutePo, status)

        // 刷新路由
        AppRouteLocator.refreshRoutes()
        return appRoutePo.toOutput()
    }

    /**
     * 批量删除路由
     */
    @DeleteMapping
    suspend fun batchDelete(
        @RequestBody @Validated input: BatchDeleteInput
    ) {
        appRouteService.batchDelete(input)
    }

}
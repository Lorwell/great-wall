package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.controller.exception.NotFoundException
import cc.shacocloud.greatwall.controller.interceptor.UserAuth
import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.dto.convert.toListOutput
import cc.shacocloud.greatwall.model.dto.convert.toOutput
import cc.shacocloud.greatwall.model.dto.input.AppRouteInput
import cc.shacocloud.greatwall.model.dto.input.AppRouteListInput
import cc.shacocloud.greatwall.model.dto.output.AppRouteListOutput
import cc.shacocloud.greatwall.model.dto.output.AppRouteOutput
import cc.shacocloud.greatwall.service.AppRouteLocator
import cc.shacocloud.greatwall.service.AppRouteService
import org.springframework.data.domain.Page
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
class AppRouteController(
    val appRouteService: AppRouteService
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
    @GetMapping
    suspend fun list(@Validated input: AppRouteListInput): Page<AppRouteListOutput> {
        return appRouteService.list(input)
            .map { it.toListOutput() }
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
        appRoutePo = appRouteService.setStatus(appRoutePo, status)

        // 刷新路由
        AppRouteLocator.refreshRoutes()
        return appRoutePo.toOutput()
    }

}
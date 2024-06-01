package cc.shacocloud.greatwall.controller

import cc.shacocloud.greatwall.model.dto.convert.toListOutput
import cc.shacocloud.greatwall.model.dto.convert.toOutput
import cc.shacocloud.greatwall.model.dto.input.AppRouteInput
import cc.shacocloud.greatwall.model.dto.input.AppRouteListInput
import cc.shacocloud.greatwall.model.dto.output.AppRouteListOutput
import cc.shacocloud.greatwall.model.dto.output.AppRouteOutput
import cc.shacocloud.greatwall.service.AppRouteService
import org.springframework.data.domain.Page
import org.springframework.validation.annotation.Validated
import org.springframework.web.bind.annotation.*

/**
 *
 * @author 思追(shaco)
 */
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

}
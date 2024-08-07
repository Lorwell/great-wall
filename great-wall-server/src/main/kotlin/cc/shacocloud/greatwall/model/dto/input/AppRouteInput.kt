package cc.shacocloud.greatwall.model.dto.input

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.mo.RouteFilters
import cc.shacocloud.greatwall.model.mo.RoutePredicates
import cc.shacocloud.greatwall.model.mo.RouteTargetConfig
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull

/**
 * @author 思追(shaco)
 */
data class AppRouteInput(

    /**
     * 名称
     */
    @field:NotBlank
    val name: String,

    /**
     * 描述
     */
    val describe: String? = null,

    /**
     * 优先级，值越高优先级越低，反之优先级越高
     */
    val priority: Int,

    /**
     * 状态
     */
    val status: AppRouteStatusEnum,

    /**
     * 目标地址配置
     */
    @field:Valid
    @field:NotNull
    val targetConfig: RouteTargetConfig,

    /**
     * 路由条件
     */
    @field:Valid
    @field:NotEmpty
    val predicates: RoutePredicates,

    /**
     * 路由过滤器插件
     */
    @field:Valid
    val filters: RouteFilters,

    )

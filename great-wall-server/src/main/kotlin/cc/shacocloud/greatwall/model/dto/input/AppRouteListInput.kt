package cc.shacocloud.greatwall.model.dto.input

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum
import cc.shacocloud.greatwall.model.dto.BaseListInput
import cc.shacocloud.greatwall.model.mo.RoutePredicates
import cc.shacocloud.greatwall.model.mo.RouteUrl
import cc.shacocloud.greatwall.model.mo.RouteUrls
import jakarta.validation.Valid
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty

/**
 *
 * @author 思追(shaco)
 */
class AppRouteListInput : BaseListInput() {

    /**
     * 状态过滤条件
     */
    var status: AppRouteStatusEnum? = null

}

package cc.shacocloud.greatwall.model.dto.input

import cc.shacocloud.greatwall.model.constant.AppRouteStatusEnum

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

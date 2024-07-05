package cc.shacocloud.greatwall.model.dto.convert

import cc.shacocloud.greatwall.model.dto.output.AppRouteOutput
import cc.shacocloud.greatwall.model.po.AppRoutePo

/**
 *
 * @author 思追(shaco)
 */
fun AppRoutePo.toOutput(): AppRouteOutput {
    return AppRouteOutput(
        id = id!!,
        name = name,
        describe = describe,
        priority = priority,
        status = status,
        targetConfig = targetConfig,
        predicates = predicates,
        createTime = createTime,
        lastUpdateTime = lastUpdateTime
    )
}
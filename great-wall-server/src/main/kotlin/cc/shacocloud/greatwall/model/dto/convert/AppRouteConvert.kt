package cc.shacocloud.greatwall.model.dto.convert

import cc.shacocloud.greatwall.model.dto.output.AppRouteListOutput
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
        urls = urls,
        predicates = predicates,
        createTime = createTime,
        lastUpdateTime = lastUpdateTime
    )
}

/**
 *
 * @author 思追(shaco)
 */
fun AppRoutePo.toListOutput(): AppRouteListOutput {
    return AppRouteListOutput(
        id = id!!,
        name = name,
        describe = describe,
        priority = priority,
        status = status,
        urls = urls,
        createTime = createTime,
        lastUpdateTime = lastUpdateTime
    )
}
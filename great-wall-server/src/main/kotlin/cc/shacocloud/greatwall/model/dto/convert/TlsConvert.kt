package cc.shacocloud.greatwall.model.dto.convert

import cc.shacocloud.greatwall.model.dto.output.TlsOutput
import cc.shacocloud.greatwall.model.po.TlsPo

/**
 *
 * @author 思追(shaco)
 */
fun TlsPo.toOutput(): TlsOutput {
    return TlsOutput(
        id = id!!,
        config = config,
        expiredTime = expiredTime,
        createTime = createTime,
        lastUpdateTime = lastUpdateTime
    )
}
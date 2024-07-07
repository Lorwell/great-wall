package cc.shacocloud.greatwall.model.dto.convert

import cc.shacocloud.greatwall.model.dto.output.TlsOutput
import cc.shacocloud.greatwall.model.mo.CustomTlsConfig
import cc.shacocloud.greatwall.model.mo.OsfipinTlsConfig
import cc.shacocloud.greatwall.model.mo.TlsConfig
import cc.shacocloud.greatwall.model.po.TlsPo

/**
 *
 * @author 思追(shaco)
 */
fun TlsPo.toOutput(): TlsOutput {
    return TlsOutput(
        id = id!!,
        config = config.toSafe(),
        expiredTime = expiredTime,
        createTime = createTime,
        lastUpdateTime = lastUpdateTime
    )
}

/**
 * 转为安全的配置输出
 */
fun TlsConfig.toSafe(): TlsConfig {

    when (this) {
        is CustomTlsConfig -> {
            return CustomTlsConfig(
                certificate = certificate,
                privateKey = "************"
            )
        }

        is OsfipinTlsConfig -> {
            return OsfipinTlsConfig(
                token = token,
                user = user,
                autoId = autoId
            )
        }
    }
    return this
}

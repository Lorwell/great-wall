package cc.shacocloud.greatwall.model.event

import cc.shacocloud.greatwall.model.mo.TlsBundleMo

/**
 * 刷新证书事件
 * @author 思追(shaco)
 */
data class RefreshTlsEvent(
    val tlsBundleMo: TlsBundleMo
)

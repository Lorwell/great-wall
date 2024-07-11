package cc.shacocloud.greatwall.model.mo

import cc.shacocloud.greatwall.controller.interceptor.UserAuthRoleEnum
import kotlinx.serialization.Serializable

/**
 * 管理员会话模型
 * @author 思追(shaco)
 */
@Serializable
data class AdminSessionMo(

    /**
     * 会话唯一id
     */
    override val sessionId: String

) : SessionMo() {

    override val role: UserAuthRoleEnum
        get() = UserAuthRoleEnum.ADMIN

}
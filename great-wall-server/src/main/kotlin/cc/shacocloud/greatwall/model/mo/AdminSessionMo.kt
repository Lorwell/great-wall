package cc.shacocloud.greatwall.model.mo

import cc.shacocloud.greatwall.controller.interceptor.UserAuthRoleEnum

/**
 * 管理员会话模型
 * @author 思追(shaco)
 */
data class AdminSessionMo(

    /**
     * 会话唯一id
     */
    override val sessionId: String

) : SessionMo() {

    override val role: UserAuthRoleEnum
        get() = UserAuthRoleEnum.ADMIN

}
package cc.shacocloud.greatwall.model.mo

import cc.shacocloud.greatwall.controller.interceptor.UserAuthRoleEnum
import kotlinx.serialization.Serializable

/**
 * 会话模型
 * @author 思追(shaco)
 */
@Serializable
sealed class SessionMo {

    /**
     * 用户角色
     */
    abstract val role: UserAuthRoleEnum

    /**
     * 用户会话唯一id
     */
    abstract val sessionId: String

}
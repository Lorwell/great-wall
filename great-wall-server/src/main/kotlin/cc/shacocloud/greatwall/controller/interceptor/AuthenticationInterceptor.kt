package cc.shacocloud.greatwall.controller.interceptor


import cc.shacocloud.greatwall.config.web.RequestMappingHandlerInterceptor
import cc.shacocloud.greatwall.controller.exception.ForbiddenException
import cc.shacocloud.greatwall.controller.exception.UnauthorizedException
import cc.shacocloud.greatwall.model.mo.SessionMo
import cc.shacocloud.greatwall.service.SessionService
import org.springframework.core.Ordered
import org.springframework.core.annotation.AnnotatedElementUtils
import org.springframework.stereotype.Service
import org.springframework.web.method.HandlerMethod
import org.springframework.web.reactive.HandlerAdapter
import org.springframework.web.reactive.result.method.annotation.RequestMappingHandlerAdapter
import org.springframework.web.server.ServerWebExchange


/**
 * 基于 [HandlerAdapter] 实现得认证拦截器。拓展 [RequestMappingHandlerAdapter]
 * @author 思追(shaco)
 */
@Service
class AuthenticationInterceptor(
    private val sessionService: SessionService
) : RequestMappingHandlerInterceptor {

    override suspend fun preHandle(exchange: ServerWebExchange, handler: HandlerMethod) {
        // 获取当前接口允许的用户认证角色访问权限，如果未设置则默认为 UserAuthRoleEnum.VISITOR
        val userAuthRole = handler.getMethodAnnotation(Auth::class.java)?.role
            ?: AnnotatedElementUtils.findMergedAnnotation(handler.beanType, Auth::class.java)?.role
            ?: let { UserAuthRoleEnum.VISITOR }

        // 获取当前用户的会话
        val currentSession = sessionService.currentSession(exchange)

        auth(userAuthRole, currentSession)
    }

    /**
     * 认证方法
     */
    suspend fun auth(
        needAuthRole: UserAuthRoleEnum,
        currentSession: SessionMo? = null
    ) {
        val currentUserRole = currentSession?.role ?: UserAuthRoleEnum.VISITOR

        // 包含则认证通过
        if (currentUserRole.level > needAuthRole.level) {

            // 如果未登录用户则抛出未登录异常
            if (currentSession == null) {
                throw UnauthorizedException()
            }
            // 已登录用户抛出无权限异常
            else {
                throw ForbiddenException()
            }
        }
    }

    override fun getOrder(): Int {
        return Ordered.HIGHEST_PRECEDENCE
    }

}
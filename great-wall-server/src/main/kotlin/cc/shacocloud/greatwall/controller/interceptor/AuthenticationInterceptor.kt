package cc.shacocloud.greatwall.controller.interceptor


import cc.shacocloud.greatwall.controller.exception.ForbiddenException
import cc.shacocloud.greatwall.controller.exception.UnauthorizedException
import cc.shacocloud.greatwall.service.SessionService
import kotlinx.coroutines.reactor.awaitSingleOrNull
import kotlinx.coroutines.reactor.mono
import org.springframework.core.annotation.AnnotatedElementUtils
import org.springframework.web.method.HandlerMethod
import org.springframework.web.reactive.HandlerAdapter
import org.springframework.web.reactive.HandlerResult
import org.springframework.web.reactive.result.method.annotation.RequestMappingHandlerAdapter
import org.springframework.web.server.ServerWebExchange
import reactor.core.publisher.Mono


/**
 * 基于 [HandlerAdapter] 实现得认证拦截器。拓展 [RequestMappingHandlerAdapter]
 * @author 思追(shaco)
 */
class AuthenticationInterceptor(
    private val requestMappingHandlerAdapter: RequestMappingHandlerAdapter,
    private val sessionService: SessionService
) : HandlerAdapter {

    override fun supports(handler: Any): Boolean {
        return requestMappingHandlerAdapter.supports(handler)
    }

    override fun handle(exchange: ServerWebExchange, handler: Any): Mono<HandlerResult> = mono {
        val handlerMethod = handler as HandlerMethod

        // 获取当前接口允许的用户认证角色访问权限，如果未设置则默认为 UserAuthRoleEnum.VISITOR
        val userAuthRole = handlerMethod.getMethodAnnotation(Auth::class.java)?.role
            ?: AnnotatedElementUtils.findMergedAnnotation(handlerMethod.beanType, Auth::class.java)?.role
            ?: let { UserAuthRoleEnum.VISITOR }


        val currentSession = sessionService.currentSession(exchange)
        val currentUserRole = currentSession?.role ?: UserAuthRoleEnum.VISITOR

        // 包含则认证通过
        if (currentUserRole.level <= userAuthRole.level) {
            requestMappingHandlerAdapter.handle(exchange, handler).awaitSingleOrNull()
        } else {
            // 如果未登录用户则抛出未登录异常
            val exception =
                if (currentSession == null) {
                    UnauthorizedException()
                } else {
                    // 已登录用户抛出无权限异常
                    ForbiddenException()
                }

            requestMappingHandlerAdapter.handleError(exchange, exception).awaitSingleOrNull()
        }
    }

}
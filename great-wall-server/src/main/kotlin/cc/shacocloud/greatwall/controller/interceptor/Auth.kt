package cc.shacocloud.greatwall.controller.interceptor

/**
 * 用于认证时判定当前角色是否被包含，如果不包含则抛出例外
 * @author 思追(shaco)
 */
enum class UserAuthRoleEnum(

    /**
     * 角色级别，高级别包含低级别
     *
     * 级别值越小，级别越高
     */
    val level: Int
) {

    /**
     * 管理员
     */
    ADMIN(0),

    /**
     * 游客
     */
    VISITOR(10),
}

/**
 *  使用该注解标识则标识该接口的认证规则
 * @author 思追(shaco)
 */
@Target(
    AnnotationTarget.FUNCTION,
    AnnotationTarget.CLASS
)
@Retention(AnnotationRetention.RUNTIME)
@MustBeDocumented
annotation class Auth(
    /**
     * 满足认证条件的角色
     */
    val role: UserAuthRoleEnum
)

/**
 * 使用该注解标识则标识该接口无需认证
 * @author 思追(shaco)
 */
@Target(
    AnnotationTarget.FUNCTION,
    AnnotationTarget.CLASS
)
@Retention(AnnotationRetention.RUNTIME)
@MustBeDocumented
@Auth(
    role = UserAuthRoleEnum.VISITOR
)
annotation class NoAuth

/**
 * 使用该注解标识则标识该接口需要认证后才可以被访问
 *
 * @author 思追(shaco)
 */
@Target(
    AnnotationTarget.FUNCTION,
    AnnotationTarget.CLASS
)
@Retention(AnnotationRetention.RUNTIME)
@MustBeDocumented
@Auth(
    role = UserAuthRoleEnum.ADMIN
)
annotation class UserAuth

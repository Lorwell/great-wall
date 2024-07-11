package cc.shacocloud.greatwall.controller.advice

/**
 * 保存原来控制层的返回值 不进行封装
 */
@Target(
    AnnotationTarget.FUNCTION,
    AnnotationTarget.CLASS
)
@Retention(AnnotationRetention.RUNTIME)
@MustBeDocumented
annotation class OriginalControllerReturnValue

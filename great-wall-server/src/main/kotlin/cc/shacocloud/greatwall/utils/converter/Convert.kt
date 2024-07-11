package cc.shacocloud.greatwall.utils.converter

import kotlin.reflect.KClass

/**
 * 转换器注解，定义在字段上，表示转换过程
 *
 * @see Converter
 * @author 思追(shaco)
 */
@Target(AnnotationTarget.FIELD)
@Retention(AnnotationRetention.RUNTIME)
@MustBeDocumented
annotation class Convert(

    val value: KClass<out Converter<*>>
)

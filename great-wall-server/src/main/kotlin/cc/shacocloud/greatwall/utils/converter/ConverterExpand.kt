package cc.shacocloud.greatwall.utils.converter

import cc.shacocloud.greatwall.utils.getValue
import org.springframework.beans.BeanUtils
import java.util.concurrent.ConcurrentHashMap
import kotlin.reflect.KClass

val converterMap = ConcurrentHashMap<KClass<out Converter<out Any>>, Converter<Any>>()

/**
 * 将指定对象转为 Map
 *
 * 字段使用 [Convert] 注解标识的使用指定转换器转换，反之使用 toString
 *
 * @author 思追(shaco)
 */
@Suppress("UNCHECKED_CAST")
fun Any.convertToMap(): Map<String, String?> {
    return this::class.java.declaredFields.associate { field ->
        val value = field.getValue(this)

        val content =
            field.getAnnotation(Convert::class.java)?.let {
                val converterClass = it.value
                val converter = converterMap.computeIfAbsent(converterClass) {
                    BeanUtils.instantiateClass(converterClass.java) as Converter<Any>
                }
                converter.write(value)
            } ?: value?.toString()

        field.name to content
    }
}

/**
 * 将 Map 转为指定对象
 *
 * 字段使用 [Convert] 注解标识的使用指定转换器转换
 *
 * @author 思追(shaco)
 */
@Suppress("UNCHECKED_CAST")
fun <T : Any> Map<String, String?>.convertToBean(clazz: KClass<T>): T {
    val paramsMap = clazz.java.declaredFields.associate { field ->
        val name = field.name
        val value = get(name)?.let { v ->
            field.getAnnotation(Convert::class.java)?.let {
                val converterClass = it.value
                val converter = converterMap.computeIfAbsent(converterClass) {
                    BeanUtils.instantiateClass(converterClass.java) as Converter<Any>
                }
                converter.read(v)
            } ?: v
        }

        name to value
    }

    val constructor = BeanUtils.getResolvableConstructor(clazz.java)
    val params = constructor.parameters.map { paramsMap[it.name] }.toTypedArray()
    return constructor.newInstance(*params)
}
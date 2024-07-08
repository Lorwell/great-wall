package cc.shacocloud.greatwall.utils

import org.springframework.util.ReflectionUtils
import java.lang.reflect.Field

/**
 * 设置属性值
 *
 * @param target 属性的源对象，null 表示静态属性
 * @param value 属性值
 * @author 思追(shaco)
 */
fun Field.setValue(target: Any? = null, value: Any? = null) {
    ReflectionUtils.makeAccessible(this)
    ReflectionUtils.setField(this, target, value)
}

/**
 * 获取属性值
 *
 * @param target 属性的源对象，null 表示静态属性
 * @author 思追(shaco)
 */
fun Field.getValue(target: Any? = null): Any? {
    ReflectionUtils.makeAccessible(this)
    return ReflectionUtils.getField(this, target)
}
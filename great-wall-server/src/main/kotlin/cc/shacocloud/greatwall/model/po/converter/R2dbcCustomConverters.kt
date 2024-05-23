package cc.shacocloud.greatwall.model.po.converter

import cc.shacocloud.greatwall.utils.json.Json
import com.fasterxml.jackson.core.type.TypeReference
import org.springframework.core.convert.converter.Converter
import org.springframework.data.convert.ReadingConverter
import org.springframework.data.convert.WritingConverter
import java.lang.reflect.ParameterizedType


/**
 * 对象转 json 字符转换器
 */
@WritingConverter
open class BeanToJsonStringConverter<T : Any> : Converter<T, String> {
    override fun convert(source: T): String? {
        return Json.mapper().writeValueAsString(source)
    }

}

/**
 * json 字符转对象
 */
@ReadingConverter
open class JsonStringToBeanConverter<T> : Converter<String, T> {
    override fun convert(source: String): T {
        return Json.mapper().readValue(source, object : TypeReference<T>() {})
    }
}

/**
 * 枚举转 [String]
 */
open class EnumToStringConverter<T : Enum<T>> : Converter<T, String> {
    override fun convert(source: T): String? {
        return source.name
    }
}

/**
 * [String] 转枚举
 */
open class StringToEnumConverter<T : Enum<T>> : Converter<String, T> {

    private val enumConstants: Array<T>

    init {
        val superClass = javaClass.genericSuperclass
        val enumClass = (superClass as ParameterizedType).actualTypeArguments[0] as Class<T>
        enumConstants = enumClass.enumConstants
    }

    override fun convert(source: String): T? {
        return enumConstants.find { it.name.equals(source, true) }
    }
}

package cc.shacocloud.greatwall.model.po.converter

import cc.shacocloud.greatwall.utils.json.Json
import com.fasterxml.jackson.core.type.TypeReference
import org.springframework.core.convert.converter.Converter
import org.springframework.data.convert.ReadingConverter
import org.springframework.data.convert.WritingConverter
import java.lang.reflect.ParameterizedType
import java.lang.reflect.Type
import java.util.*


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

    private val typeReference: TypeReference<T>

    init {
        val superClass = javaClass.genericSuperclass
        val type = (superClass as ParameterizedType).actualTypeArguments[0]
        typeReference = object : TypeReference<T>() {
            override fun getType(): Type {
                return type
            }
        }
    }

    override fun convert(source: String): T {
        return Json.mapper().readValue(source, typeReference)
    }
}

/**
 * 枚举转 [String]
 */
@WritingConverter
open class EnumToStringConverter<T : Enum<T>> : Converter<T, String> {
    override fun convert(source: T): String? {
        return source.name
    }
}

/**
 * [String] 转枚举
 */
@ReadingConverter
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

/**
 * [Date] 转 [Long]
 */
@WritingConverter
class DateToLongConverter : Converter<Date, Long> {
    override fun convert(source: Date): Long {
        return source.time
    }
}


/**
 * [Long] 转 [Date]
 */
@ReadingConverter
class LongToDateConverter : Converter<Long, Date> {
    override fun convert(source: Long): Date {
        return Date(source)
    }
}

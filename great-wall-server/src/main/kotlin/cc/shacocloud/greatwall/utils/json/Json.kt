package cc.shacocloud.greatwall.utils.json

import cc.shacocloud.greatwall.config.serializer.DateDeserializer
import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.core.JsonToken
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.DeserializationFeature
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.SerializationFeature
import com.fasterxml.jackson.databind.introspect.JacksonAnnotationIntrospector
import com.fasterxml.jackson.databind.module.SimpleModule
import com.fasterxml.jackson.datatype.jsr310.JavaTimeModule
import com.fasterxml.jackson.module.kotlin.jacksonObjectMapper
import java.io.IOException
import java.util.*

/**
 * Json 操作，基于 jackson 提供两种 [ObjectMapper]
 *
 * @author 思追(shaco)
 */
object Json {

    private val mapper = jacksonObjectMapper()

    private val prettyMapper = jacksonObjectMapper()

    init {
        initialize()
    }

    private fun initialize() {
        mapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false)
        // 非标准JSON，但我们允许在JSON中使用C风格的注释
        mapper.configure(JsonParser.Feature.ALLOW_COMMENTS, true)
        // 忽略Bean中不存在属性的匹配
        mapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        mapper.setTimeZone(TimeZone.getDefault())
        // 支持注解处理
        mapper.setAnnotationIntrospector(JacksonAnnotationIntrospector())

        prettyMapper.configure(JsonParser.Feature.ALLOW_COMMENTS, true)
        prettyMapper.configure(SerializationFeature.INDENT_OUTPUT, true)
        prettyMapper.configure(SerializationFeature.FAIL_ON_EMPTY_BEANS, false)
        prettyMapper.configure(DeserializationFeature.FAIL_ON_UNKNOWN_PROPERTIES, false)
        prettyMapper.setTimeZone(TimeZone.getDefault())
        prettyMapper.setAnnotationIntrospector(JacksonAnnotationIntrospector())

        // 自定义时间反序列器
        val simpleModule = SimpleModule()
        simpleModule.addDeserializer(Date::class.java, DateDeserializer())

        val modules = arrayOf(
            simpleModule,
            JavaTimeModule()
        )

        for (module in modules) {
            mapper.registerModule(module)
            prettyMapper.registerModule(module)
        }
    }

    /**
     * @return 返回不缩进格式的 [ObjectMapper]
     */
    fun mapper(): ObjectMapper {
        return mapper
    }

    /**
     * @return 返回缩进格式的 [ObjectMapper]
     */
    fun prettyMapper(): ObjectMapper {
        return prettyMapper
    }

    /**
     * 使用底层Jackson映射器将POJO编码为JSON
     *
     * @param obj 模型
     * @throws EncodeException 如果无法对属性进行编码
     */
    @Throws(EncodeException::class)
    fun encode(obj: Any): String {
        try {
            return mapper().writeValueAsString(obj)
        } catch (e: Exception) {
            throw EncodeException("未能编码为JSON: " + e.message)
        }
    }

    /**
     * 使用底层Jackson映射器将POJO编码为JSON，并带有漂亮的缩进。
     *
     * @param obj 模型
     * @throws EncodeException 如果无法对属性进行编码
     */
    @Throws(EncodeException::class)
    fun encodePrettily(obj: Any): String {
        try {
            return prettyMapper().writeValueAsString(obj)
        } catch (e: Exception) {
            throw EncodeException("未能编码为JSON: " + e.message)
        }
    }

    /**
     * @see convertValue
     */
    fun <T> convertValue(obj: Any, clazz: Class<T>): T {
        return convertValue(mapper(), obj, clazz)
    }

    /**
     * @see convertValue
     */
    fun <T> convertValue(obj: Any, type: TypeReference<T>): T {
        return convertValue(mapper(), obj, type)
    }

    /**
     * 通过将值写入临时缓冲区并从缓冲区中读取指定的目标类型，实现从给定值到给定值类型的实例的两步转换方法。
     */
    fun <T> convertValue(objectMapper: ObjectMapper, obj: Any, clazz: Class<T>): T {
        return objectMapper.convertValue(obj, clazz)
    }

    /**
     * @see convertValue
     */
    fun <T> convertValue(objectMapper: ObjectMapper, obj: Any, type: TypeReference<T>): T {
        return objectMapper.convertValue(obj, type)
    }


    /**
     * 将给定的JSON字符串解码为给定类类型的模型
     *
     * @param str   JSON字符串
     * @param clazz 要映射到的类
     * @param <T>   泛型类型
     * @return T的一个实例
     * @throws DecodeException 当存在解析或无效映射时
    </T> */
    @Throws(DecodeException::class)
    fun <T> decodeValue(str: String, clazz: Class<T>): T {
        return fromParser(mapper(), createParser(mapper(), str), clazz)
    }

    /**
     * 将给定的JSON字符串解码为给定类型模型
     *
     * @param str  JSON字符串
     * @param type 要映射到的类
     * @param <T>  泛型类型
     * @return T的一个实例
     * @throws DecodeException 当存在解析或无效映射时
    </T> */
    @Throws(DecodeException::class)
    fun <T> decodeValue(str: String, type: TypeReference<T>): T {
        return fromParser(mapper(), createParser(mapper(), str), type)
    }

    private fun createParser(objectMapper: ObjectMapper, str: String): JsonParser {
        try {
            return objectMapper.factory.createParser(str)
        } catch (e: IOException) {
            throw DecodeException("无法解码:" + e.message, e)
        }
    }

    @Throws(DecodeException::class)
    private fun <T> fromParser(objectMapper: ObjectMapper, parser: JsonParser, type: TypeReference<T>): T {
        val value: T
        val remaining: JsonToken?

        try {
            value = objectMapper.readValue(parser, type)
            remaining = parser.nextToken()
        } catch (e: Exception) {
            throw DecodeException("无法解码:" + e.message, e)
        } finally {
            close(parser)
        }

        if (remaining != null) {
            throw DecodeException("意想不到的令牌")
        }
        return value
    }

    @Throws(DecodeException::class)
    private fun <T> fromParser(objectMapper: ObjectMapper, parser: JsonParser, type: Class<T>): T {
        val value: T
        val remaining: JsonToken?
        try {
            value = objectMapper.readValue(parser, type)
            remaining = parser.nextToken()
        } catch (e: Exception) {
            throw DecodeException("无法解码:" + e.message, e)
        } finally {
            close(parser)
        }

        if (remaining != null) {
            throw DecodeException("意想不到的令牌")
        }
        return value
    }

    private fun close(parser: JsonParser) {
        try {
            parser.close()
        } catch (ignore: IOException) {
        }
    }
}

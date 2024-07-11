package cc.shacocloud.greatwall.utils.converter

/**
 * 转换器
 *
 * @see Convert
 * @author 思追(shaco)
 */
interface Converter<T : Any> {

    /**
     * 将源类型转为字符
     */
    fun write(any: T?): String

    /**
     * 读取内容转为源类型
     */
    fun read(content: String): T?

}
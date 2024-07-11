package cc.shacocloud.greatwall.utils.converter

/**
 * 布尔值转换器
 * @author 思追(shaco)
 */
class BooleanConverter : Converter<Boolean> {

    override fun write(any: Boolean?): String {
        return any.toString()
    }

    override fun read(content: String): Boolean {
        return content.toBoolean()
    }

}
package cc.shacocloud.greatwall.utils

/**
 * 将指定字节值转为带单位的字符串值
 * @author 思追(shaco)
 */
fun Long.byteToUnitStr(): String {
    val size = this
    val num = 1024.00 // byte
    return when {
        size < num -> "${size}B"
        size < num * num -> "%.2fK".format(size / num) // kb
        size < num * num * num -> "%.2fM".format(size / (num * num)) // MB
        size < num * num * num * num -> "%.2fG".format(size / (num * num * num)) // GB
        else -> "%.2fT".format(size / (num * num * num * num)) // TB
    }
}
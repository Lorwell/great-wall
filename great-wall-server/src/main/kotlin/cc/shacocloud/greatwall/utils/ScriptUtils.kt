package cc.shacocloud.greatwall.utils

import org.springframework.core.io.support.EncodedResource
import org.springframework.r2dbc.connection.init.ScriptException

/**
 * 脚本工具类
 * @author 思追(shaco)
 */
object ScriptUtils {

    /**
     * 将 SQL 脚本拆分为由提供的分隔符字符串分隔的单独语句，并返回包含每个单独语句的List 。
     * 在脚本中，将遵循提供的 commentPrefixes ：任何以注释前缀之一开头并延伸到行尾的文本都将从输出中省略。
     * 同样，将遵循提供的 blockCommentStartDelimiter和 blockCommentEndDelimiter分隔符：任何包含在块注释中的文本都将从输出中省略。
     * 此外，多个相邻的空格字符将折叠成一个空格。
     *
     * @param resource SQL脚本资源
     * @param separator 分隔每个语句的文本
     * @param commentPrefixes 标识 SQL 行注释的前缀
     * @param blockCommentStartDelimiter 起始块注释分隔符
     * @param blockCommentEndDelimiter 结束块注释分隔符
     * @throws ScriptException 如果拆分 SQL 脚本时发生错误
     */
    fun splitSqlScript(
        resource: EncodedResource,
        separator: String = ";",
        commentPrefixes: Array<String> = arrayOf("--"),
        blockCommentStartDelimiter: String = "/*",
        blockCommentEndDelimiter: String = "*/"
    ): List<String> {
        val script = resource.reader.use { it.readText() }
        return splitSqlScript(script, separator, commentPrefixes, blockCommentStartDelimiter, blockCommentEndDelimiter)
    }

    /**
     * 将 SQL 脚本拆分为由提供的分隔符字符串分隔的单独语句，并返回包含每个单独语句的List 。
     * 在脚本中，将遵循提供的 commentPrefixes ：任何以注释前缀之一开头并延伸到行尾的文本都将从输出中省略。
     * 同样，将遵循提供的 blockCommentStartDelimiter和 blockCommentEndDelimiter分隔符：任何包含在块注释中的文本都将从输出中省略。
     * 此外，多个相邻的空格字符将折叠成一个空格。
     *
     * @param script SQL脚本
     * @param separator 分隔每个语句的文本
     * @param commentPrefixes 标识 SQL 行注释的前缀
     * @param blockCommentStartDelimiter 起始块注释分隔符
     * @param blockCommentEndDelimiter 结束块注释分隔符
     * @throws ScriptException 如果拆分 SQL 脚本时发生错误
     */
    fun splitSqlScript(
        script: String,
        separator: String = ";",
        commentPrefixes: Array<String> = arrayOf("--"),
        blockCommentStartDelimiter: String = "/*",
        blockCommentEndDelimiter: String = "*/"
    ): List<String> {

        val statements: MutableList<String> = ArrayList()
        var sb = StringBuilder()
        var inSingleQuote = false
        var inDoubleQuote = false
        var inEscape = false

        var i = 0
        while (i < script.length) {
            var c = script[i]
            if (inEscape) {
                inEscape = false
                sb.append(c)
                i++
                continue
            }
            if (c == '\\') {
                inEscape = true
                sb.append(c)
                i++
                continue
            }
            if (!inDoubleQuote && (c == '\'')) {
                inSingleQuote = !inSingleQuote
            } else if (!inSingleQuote && (c == '"')) {
                inDoubleQuote = !inDoubleQuote
            }
            if (!inSingleQuote && !inDoubleQuote) {
                if (script.startsWith(separator, i)) {
                    if (sb.isNotEmpty()) {
                        statements.add(sb.toString())
                        sb = StringBuilder()
                    }
                    i += separator.length - 1
                    i++
                    continue
                } else if (startsWithAny(script, commentPrefixes, i)) {
                    val indexOfNextNewline = script.indexOf('\n', i)
                    if (indexOfNextNewline > i) {
                        i = indexOfNextNewline
                        i++
                        continue
                    } else {
                        break
                    }
                } else if (script.startsWith(blockCommentStartDelimiter, i)) {
                    val indexOfCommentEnd = script.indexOf(blockCommentEndDelimiter, i)
                    if (indexOfCommentEnd > i) {
                        i = indexOfCommentEnd + blockCommentEndDelimiter.length - 1
                        i++
                        continue
                    } else {
                        throw IllegalArgumentException("缺少块注释结束分隔符：$blockCommentEndDelimiter")
                    }
                } else if (c == ' ' || c == '\r' || c == '\n' || c == '\t') {
                    if (sb.isNotEmpty() && sb[sb.length - 1] != ' ') {
                        c = ' '
                    } else {
                        i++
                        continue
                    }
                }
            }
            sb.append(c)
            i++
        }

        if (sb.isNotBlank()) {
            statements.add(sb.toString())
        }

        return statements
    }

    fun startsWithAny(script: String, prefixes: Array<String>, offset: Int): Boolean {
        for (prefix in prefixes) {
            if (script.startsWith(prefix, offset)) {
                return true
            }
        }
        return false
    }

}
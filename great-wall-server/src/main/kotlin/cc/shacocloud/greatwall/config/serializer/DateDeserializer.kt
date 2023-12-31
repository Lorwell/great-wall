package cc.shacocloud.greatwall.config.serializer

import com.fasterxml.jackson.core.JsonParser
import com.fasterxml.jackson.databind.DeserializationContext
import com.fasterxml.jackson.databind.annotation.JacksonStdImpl
import com.fasterxml.jackson.databind.deser.std.StdDeserializer
import java.io.UnsupportedEncodingException
import java.net.URLDecoder
import java.text.ParseException
import java.text.SimpleDateFormat
import java.util.*
import java.util.regex.Pattern

/**
 * 日期值反序列化
 * @author 思追(shaco)
 */
class DateDeserializer(vc: Class<*>? = null) : StdDeserializer<Date>(vc) {

    constructor() : this(null)

    companion object {

        /** 格式匹配模式  */
        private val PATTERN1: Pattern = Pattern.compile("\\d{4}")

        /** 格式匹配模式  */
        private val PATTERN2: Pattern = Pattern.compile("\\d{4}-\\d{1,2}")

        /** 格式匹配模式  */
        private val PATTERN3: Pattern = Pattern.compile("(\\d{4}-\\d{1,2}-\\d{1,2})")

        /** 格式匹配模式  */
        private val PATTERN4: Pattern = Pattern.compile("(\\d{4}-\\d{1,2}-\\d{1,2} \\d{1,2}:\\d{1,2})")

        /** 格式匹配模式  */
        private val PATTERN5: Pattern = Pattern.compile("\\d{4}-\\d{1,2}-\\d{1,2}\\s\\d{1,2}:\\d{1,2}:\\d{1,2}")

        /** 格式匹配模式  */
        private val PATTERN6: Pattern = Pattern.compile("\\d{4}-\\d{1,2}-\\d{1,2}\\s\\d{1,2}:\\d{1,2}:\\d{1,2}\\.\\d+")

        /** 格式匹配模式  */
        private val PATTERN7: Pattern = Pattern.compile("\\d{4}/\\d{1,2}/\\d{1,2}")

        /** 格式匹配模式  */
        private val PATTERN8: Pattern =
            Pattern.compile("\\w{3}\\s\\w{3}\\s\\d{1,2}\\s\\d{4}\\s\\d{1,2}:\\d{1,2}:\\d{1,2}\\sGMT\\+0800")

        /** 格式匹配模式  */
        private val PATTERN9: Pattern = Pattern.compile("\\d{4}\\d{1,2}")

        /** 格式匹配模式  */
        private val PATTERN10: Pattern = Pattern.compile("(\\d{4}\\d{1,2}\\d{1,2})")

        /** 格式化  */
        private val patternMap = HashMap<Pattern, String>()

        /** 格式化  */
        private val patternList = ArrayList<Pattern>(5)

        init {
            patternMap[PATTERN1] = "yyyy"
            patternMap[PATTERN2] = "yyyy-MM"
            patternMap[PATTERN3] = "yyyy-MM-dd"
            patternMap[PATTERN4] = "yyyy-MM-dd HH:mm"
            patternMap[PATTERN5] = "yyyy-MM-dd HH:mm:ss"
            patternMap[PATTERN6] = "yyyy-MM-dd HH:mm:ss.SSS"
            patternMap[PATTERN7] = "yyyy/MM/dd"
            patternMap[PATTERN8] = "EEE MMM dd yyyy HH:mm:ss 'GMT+0800'"
            patternMap[PATTERN9] = "yyyyMM"
            patternMap[PATTERN10] = "yyyyMMdd"

            // 添加pattern
            patternList.add(PATTERN1)
            patternList.add(PATTERN2)
            patternList.add(PATTERN3)
            patternList.add(PATTERN4)
            patternList.add(PATTERN5)
            patternList.add(PATTERN6)
            patternList.add(PATTERN7)
            patternList.add(PATTERN8)
            patternList.add(PATTERN9)
            patternList.add(PATTERN10)
        }
    }


    /**
     * @see com.fasterxml.jackson.databind.JsonDeserializer.deserialize
     */
    override fun deserialize(p: JsonParser, ctxt: DeserializationContext): Date? {
        return getPatternDate(p.valueAsString)
    }


    /**
     * 获取需要反序列化为正确格式的日期
     *
     * @param strDateValue 字符串类型的日期值
     * @return Date
     */
    private fun getPatternDate(strDateValue: String?): Date? {
        var value = strDateValue?.trim()
        if (value == null || "" == value || "null".equals(value, ignoreCase = true)) {
            return null
        }
        // 解决字符串被自动转码导致的问题，在此将转码后的字符串还原。
        if (value.indexOf('%') >= 0) {
            try {
                value = URLDecoder.decode(value, "UTF-8")
            } catch (e: UnsupportedEncodingException) {
                //
            }
        }

        val format = getMatchFormat(value!!)
        if (format == null) {
            // 如果以上8种时间格式都无法匹配，校验是否是时间戳格式，如果是就直接转换为Date，否则直接抛出异常
            val matcher = Pattern.compile("[-]?\\d+").matcher(value)
            val isMatch: Boolean = matcher.matches()
            if (isMatch) {
                return Date(value.toLong())
            }
            throw IllegalArgumentException("不支持的时间格式:$value")
        }

        if (format.indexOf("GMT") > 0) {
            val objSimpleFormat = SimpleDateFormat(format, Locale.US)
            try {
                return objSimpleFormat.parse(value)
            } catch (e: ParseException) {
                throw IllegalArgumentException("不支持的时间格式:$value")
            }
        }

        val sdf = SimpleDateFormat(format)
        try {
            return sdf.parse(value)
        } catch (e: ParseException) {
            throw IllegalArgumentException("不支持的时间格式:$value")
        }
    }


    /**
     * 根据值获取合适的格式
     *
     *
     * @param value 数据
     * @return 格式
     */
    private fun getMatchFormat(value: String): String? {
        val iterator: Iterator<Pattern> = patternList.iterator()
        while (iterator.hasNext()) {
            val pattern = iterator.next()
            val matcher = pattern.matcher(value)
            val isMatch: Boolean = matcher.matches()
            if (isMatch) {
                return patternMap[pattern]
            }
        }
        return null
    }

}
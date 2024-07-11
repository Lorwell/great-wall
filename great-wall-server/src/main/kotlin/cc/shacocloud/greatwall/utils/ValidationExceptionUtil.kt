package cc.shacocloud.greatwall.utils

import cc.shacocloud.greatwall.controller.specification.FieldsRespMsg
import cc.shacocloud.greatwall.controller.specification.RespFieldError
import cc.shacocloud.greatwall.controller.specification.ResponseBusinessMessage
import jakarta.validation.ConstraintViolation
import jakarta.validation.ElementKind
import org.springframework.context.i18n.LocaleContextHolder
import org.springframework.util.StringUtils
import org.springframework.validation.FieldError
import org.springframework.validation.ObjectError

/**
 * @author 思追(shaco)
 */
object ValidationExceptionUtil {


    /**
     * 异常转换
     *
     * @param allErrors [ObjectError]
     * @return [FieldsRespMsg]
     */
    fun objectErrorViolation(allErrors: List<ObjectError>): FieldsRespMsg {
        val fieldErrorArray = allErrors.mapNotNull { fieldErrorFormat(it) }
        return getFieldsRespMsg(fieldErrorFormat(fieldErrorArray))
    }

    /**
     * 异常转换
     *
     * @param constraintViolations [ConstraintViolation]
     * @return [FieldsRespMsg]
     */
    fun constraintViolation(constraintViolations: Iterable<ConstraintViolation<*>>): FieldsRespMsg {
        return getFieldsRespMsg(fieldErrorFormat(constraintViolations))
    }

    /**
     * 错误字段格式化
     */
    fun fieldErrorFormat(constraintViolations: Iterable<ConstraintViolation<*>>): Map<String, MutableList<RespFieldError>> {
        val fieldMap = mutableMapOf<String, MutableList<RespFieldError>>()
        for (violation in constraintViolations) {
            val (key, value) = fieldErrorFormat(violation)
            fieldMap.computeIfAbsent(key) { arrayListOf() }.add(value)
        }
        return fieldMap
    }

    /**
     * 错误字段格式化
     */
    fun fieldErrorFormat(fieldErrorArray: List<Pair<String, RespFieldError>>): Map<String, List<RespFieldError>> {
        val fieldMap = HashMap<String, MutableList<RespFieldError>>()

        for ((key, value) in fieldErrorArray) {
            fieldMap.computeIfAbsent(key) { ArrayList(4) }.add(value)
        }

        return fieldMap
    }

    /**
     * 错误字段格式化为模型
     */
    fun getFieldsRespMsg(fields: Map<String, List<RespFieldError>>): FieldsRespMsg {
        val messageCode: String = ResponseBusinessMessage.UNPROCESSABLE_ENTITY.code

        val message = MessageSourceHolder.getMessage(
            messageCode,
            null,
            messageCode,
            LocaleContextHolder.getLocale()
        )

        return FieldsRespMsg(
            messageCode,
            message ?: messageCode,
            fields
        )
    }

    /**
     * 错误字段格式化
     */
    fun fieldErrorFormat(objectError: ObjectError): Pair<String, RespFieldError>? {
        if (objectError.contains(ConstraintViolation::class.java)) {
            val unwrap = objectError.unwrap(ConstraintViolation::class.java)
            return fieldErrorFormat(unwrap)
        }

        // 字段错误
        if (objectError is FieldError) {
            val messageCode = objectError.code ?: objectError.defaultMessage

            return messageCode?.let {
                val params = HashMap<String, Any>()
                val fieldPath = objectError.field
                val rejectedValue = objectError.rejectedValue

                val respError =
                    i18nFormat(
                        params,
                        messageCode,
                        fieldPath,
                        rejectedValue
                    )
                fieldPath to respError
            }
        }

        return null
    }

    /**
     * 错误字段格式化
     */
    fun fieldErrorFormat(violation: ConstraintViolation<*>): Pair<String, RespFieldError> {
        val fieldPath = determineField(violation)
        val respError = i18nFormat(fieldPath, violation)
        return fieldPath to respError
    }

    /**
     * 国际化消息格式化
     */
    fun i18nFormat(
        fieldPath: String,
        violation: ConstraintViolation<*>
    ): RespFieldError {
        val messageCode = if (StringUtils.hasLength(violation.messageTemplate)) {
            StringUtils.trimTrailingCharacter(
                StringUtils.trimLeadingCharacter(violation.messageTemplate, '{'),
                '}'
            )
        } else {
            violation.message
        }

        val constraintDescriptor = violation.constraintDescriptor
        val attributes = constraintDescriptor.attributes

        val params = HashMap<String, Any>()
        if (!attributes.isNullOrEmpty()) {
            params.putAll(attributes)
        }

        val rejectedValue = violation.invalidValue

        return i18nFormat(
            params,
            messageCode,
            fieldPath,
            rejectedValue
        )
    }


    private fun i18nFormat(
        params: MutableMap<String, Any>,
        messageCode: String,
        fieldPath: String,
        rejectedValue: Any?
    ): RespFieldError {
        // 提取字段路径的最后的字段
        val lastIndexOf = fieldPath.lastIndexOf('.')
        val field = if (lastIndexOf < 0) fieldPath else fieldPath.substring(lastIndexOf)

        params["field"] = field
        params["value"] = rejectedValue ?: "null"

        return i18nFormat(
            messageCode,
            rejectedValue ?: "null",
            params
        )
    }

    /**
     * 国际化消息格式化
     */
    fun i18nFormat(messageCode: String, rejectedValue: Any, params: Map<String, Any>): RespFieldError {
        val messageTemplate = MessageSourceHolder.getMessage(
            messageCode,
            null,
            messageCode,
            LocaleContextHolder.getLocale()
        )

        val message = format(messageTemplate, params) ?: messageCode
        return RespFieldError(messageCode, message, rejectedValue)
    }

    /**
     * 为给定的约束冲突确定一个字段。
     *
     *
     * 实现返回字符串化的属性路径。
     */
    fun determineField(violation: ConstraintViolation<*>): String {
        val path = violation.propertyPath
        val sb = StringBuilder()
        var first = true
        for (node in path) {
            if (node.isInIterable) {
                sb.append('[')
                val index = node.index
                sb.append(index)
                sb.append(']')
            }
            val name: String = node.name
            val elementKind = node.kind
            if ((elementKind.equals(ElementKind.PROPERTY) || elementKind.equals(ElementKind.PARAMETER))
                && !name.startsWith("<")
            ) {
                if (!first) {
                    sb.append('.')
                }
                first = false
                sb.append(name)
            }
        }
        return sb.toString()
    }


    /**
     * 格式化文本，使用 {varName} 占位<br></br>
     * map = {a: "aValue", b: "bValue"} format("{a} and {b}", map) ---=》 aValue and bValue
     *
     * @param template   文本模板，被替换的部分用 {key} 表示
     * @param map        参数值对
     * @return 格式化后的文本
     */
    fun format(template: CharSequence?, map: Map<String, Any>? = null): String? {
        if (null == template) return null
        else if (map.isNullOrEmpty()) return template.toString()

        var template2 = template.toString()
        var value: String
        for ((key, v) in map) {
            value = v.toString()
            template2 = template2.replace("{$key}", value, false)
        }
        return template2
    }

}
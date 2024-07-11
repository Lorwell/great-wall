package cc.shacocloud.greatwall.utils

import org.springframework.context.MessageSource
import org.springframework.context.MessageSourceResolvable
import org.springframework.context.NoSuchMessageException
import org.springframework.context.i18n.LocaleContextHolder
import org.springframework.stereotype.Component
import java.util.*

/**
 * spring MessageSource 的持有者对象，提供基于 MessageSource 的静态方法使用
 *
 * @author 思追(shaco)
 */
@Component
class MessageSourceHolder(messageSource: MessageSource) {

    init {
        Companion.messageSource = messageSource
    }

    companion object {

        private var messageSource: MessageSource? = null

        /**
         * 使用[LocaleContextHolder.getLocale]
         *
         * @see MessageSource.getMessage
         */
        @Throws(NoSuchMessageException::class)
        fun getMessage(code: String, args: Array<Any>? = null): String {
            return getInstance().getMessage(code, args, LocaleContextHolder.getLocale())
        }

        /**
         * @see MessageSource.getMessage
         */
        fun getMessage(
            code: String,
            args: Array<Any>? = null,
            defaultMessage: String? = null,
            locale: Locale
        ): String? {
            return getInstance().getMessage(code, args, defaultMessage, locale)
        }

        /**
         * @see MessageSource.getMessage
         */
        @Throws(NoSuchMessageException::class)
        fun getMessage(code: String, args: Array<Any>? = null, locale: Locale): String {
            return getInstance().getMessage(code, args, locale)
        }

        /**
         * @see MessageSource.getMessage
         */
        @Throws(NoSuchMessageException::class)
        fun getMessage(resolvable: MessageSourceResolvable, locale: Locale): String {
            return getInstance().getMessage(resolvable, locale)
        }

        private fun getInstance(): MessageSource {
            check()
            return messageSource!!
        }

        protected fun check() {
            requireNotNull(messageSource) { "MessageSource 未初始化，无法使用！" }
        }
    }
}

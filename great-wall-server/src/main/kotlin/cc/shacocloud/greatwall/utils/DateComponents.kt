package cc.shacocloud.greatwall.utils

import kotlinx.datetime.format.DateTimeComponents
import kotlinx.datetime.format.DateTimeComponents.Companion.Format
import kotlinx.datetime.format.DateTimeFormat
import kotlinx.datetime.format.char

/**
 * yyyy-MM-dd HH:mm:ss
 * @author 思追(shaco)
 */
val DATE_TIME_FORMAT: DateTimeFormat<DateTimeComponents> = Format {
    year()
    char('-')
    monthNumber()
    char('-')
    dayOfMonth()
    char(' ')
    hour()
    char(':')
    minute()
    char(':')
    second()
}

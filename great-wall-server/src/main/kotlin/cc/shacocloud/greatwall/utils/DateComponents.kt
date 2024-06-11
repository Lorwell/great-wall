package cc.shacocloud.greatwall.utils

import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.LocalDateTime.Companion.Format
import kotlinx.datetime.format.DateTimeFormat
import kotlinx.datetime.format.char

/**
 * yyyy-MM-dd HH:mm:ss
 * @author 思追(shaco)
 */
val DATE_TIME_FORMAT: DateTimeFormat<LocalDateTime> = Format {
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

/**
 * yyyy-MM-dd HH:mm
 * @author 思追(shaco)
 */
val DATE_TIME_MINUTE_FORMAT: DateTimeFormat<LocalDateTime> = Format {
    year()
    char('-')
    monthNumber()
    char('-')
    dayOfMonth()
    char(' ')
    hour()
    char(':')
    minute()
}

/**
 * yyyy-MM-dd HH
 * @author 思追(shaco)
 */
val DATE_TIME_HOUR_FORMAT: DateTimeFormat<LocalDateTime> = Format {
    year()
    char('-')
    monthNumber()
    char('-')
    dayOfMonth()
    char(' ')
    hour()
}

/**
 * yyyy-MM-dd
 * @author 思追(shaco)
 */
val DATE_TIME_DAY_FORMAT: DateTimeFormat<LocalDateTime> = Format {
    year()
    char('-')
    monthNumber()
    char('-')
    dayOfMonth()
}

package cc.shacocloud.greatwall.utils

import kotlinx.datetime.LocalDateTime
import kotlinx.datetime.LocalDateTime.Companion.Format
import kotlinx.datetime.format.DateTimeComponents
import kotlinx.datetime.format.DateTimeFormat
import kotlinx.datetime.format.char
import kotlinx.datetime.format.DateTimeComponents.Companion.Format as ComponentFormat

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


/**
 * HH:mm
 * @author 思追(shaco)
 */
val TIME_MINUTE_FORMAT: DateTimeFormat<LocalDateTime> = Format {
    hour()
    char(':')
    minute()
}

/**
 * HH:mm:ss
 * @author 思追(shaco)
 */
val TIME_SECOND_FORMAT: DateTimeFormat<LocalDateTime> = Format {
    hour()
    char(':')
    minute()
    char(':')
    second()
}


/**
 * MM-dd HH:mm
 * @author 思追(shaco)
 */
val TIME_DAY_MINUTE_FORMAT: DateTimeFormat<LocalDateTime> = Format {
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
 * MM-dd HH
 * @author 思追(shaco)
 */
val TIME_DAY_HOUR_FORMAT: DateTimeFormat<LocalDateTime> = Format {
    monthNumber()
    char('-')
    dayOfMonth()
    char(' ')
    hour()
    char(':')
    minute()
}


/**
 * yyyyMMdd
 * @author 思追(shaco)
 */
val DATE_TIME_DAY_NO_SEP_FORMAT: DateTimeFormat<LocalDateTime> = Format {
    year()
    monthNumber()
    dayOfMonth()
}

/**
 * yyyyMMdd
 * @author 思追(shaco)
 */
val DATE_TIME_DAY_NO_SEP_COMPONENTS_FORMAT: DateTimeFormat<DateTimeComponents> = ComponentFormat {
    year()
    monthNumber()
    dayOfMonth()
}

/**
 * HH:mm:ss
 * @author 思追(shaco)
 */
val TIME_SECOND_COMPONENTS_FORMAT: DateTimeFormat<DateTimeComponents> = ComponentFormat {
    hour()
    char(':')
    minute()
    char(':')
    second()
}

/**
 * MM-dd HH:mm
 * @author 思追(shaco)
 */
val TIME_DAY_MINUTE_COMPONENTS_FORMAT: DateTimeFormat<DateTimeComponents> = ComponentFormat {
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
 * MM-dd HH
 * @author 思追(shaco)
 */
val TIME_DAY_HOUR_COMPONENTS_FORMAT: DateTimeFormat<DateTimeComponents> = ComponentFormat {
    monthNumber()
    char('-')
    dayOfMonth()
    char(' ')
    hour()
    char(':')
    minute()
}

/**
 * yyyy-MM-dd
 * @author 思追(shaco)
 */
val DATE_TIME_DAY_COMPONENTS_FORMAT: DateTimeFormat<DateTimeComponents> = ComponentFormat {
    year()
    char('-')
    monthNumber()
    char('-')
    dayOfMonth()
}

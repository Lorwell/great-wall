package cc.shacocloud.greatwall.utils

import java.time.format.DateTimeFormatter

/**
 * yyyy-MM-dd HH:mm:ss
 * @author 思追(shaco)
 */
val DATE_TIME_FORMAT: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")

/**
 * yyyy-MM-dd HH:mm
 * @author 思追(shaco)
 */
val DATE_TIME_MINUTE_FORMAT: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")

/**
 * yyyy-MM-dd HH
 * @author 思追(shaco)
 */
val DATE_TIME_HOUR_FORMAT: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH")

/**
 * yyyy-MM-dd
 * @author 思追(shaco)
 */
val DATE_TIME_DAY_FORMAT: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")

/**
 * HH:mm
 * @author 思追(shaco)
 */
val TIME_MINUTE_FORMAT: DateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm")

/**
 * HH:mm:ss
 * @author 思追(shaco)
 */
val TIME_SECOND_FORMAT: DateTimeFormatter = DateTimeFormatter.ofPattern("HH:mm:ss")

/**
 * MM-dd HH:mm
 * @author 思追(shaco)
 */
val TIME_DAY_MINUTE_FORMAT: DateTimeFormatter = DateTimeFormatter.ofPattern("MM-dd HH:mm")

/**
 * MM-dd HH
 * @author 思追(shaco)
 */
val TIME_DAY_HOUR_FORMAT: DateTimeFormatter = DateTimeFormatter.ofPattern("MM-dd HH")


/**
 * yyyyMMdd
 * @author 思追(shaco)
 */
val DATE_TIME_DAY_NO_SEP_FORMAT: DateTimeFormatter = DateTimeFormatter.ofPattern("yyyyMMdd")
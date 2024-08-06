package cc.shacocloud.greatwall.utils

import org.slf4j.Logger
import org.slf4j.LoggerFactory

/**
 * 高效的获取当前时间的秒数，可以使用不同的实现
 *
 * @author 思追(shaco)
 */
interface Time {

    companion object {

        val DEFAULT: Time = TimerCacheTime

    }

    /**
     * 获取当前秒戳
     */
    fun getCurrentTimeSeconds(): Long

}

/**
 * 使用定时器缓存时间
 *
 * @author 思追(shaco)
 */
object TimerCacheTime : Time {

    private val log: Logger = LoggerFactory.getLogger(TimerCacheTime::class.java)

    // 当前时间的毫秒戳
    private var seconds: Long = System.currentTimeMillis() / 1000

    init {
        val runnable = Runnable {
            while (true) {
                try {
                    seconds = System.currentTimeMillis() / 1000
                    delayStartOfSecond()
                } catch (e: Exception) {

                    if (e is InterruptedException) {
                        if (log.isWarnEnabled) {
                            log.warn("TimerCacheTime 调度收到中断信息！")
                        }
                        break
                    }

                    if (log.isErrorEnabled) {
                        log.error("TimerCacheTime 调度发生例外！", e)
                    }
                }
            }
        }
        val thread = Thread(runnable, "TimeCacheScheduled")
        thread.isDaemon = true
        thread.start()
    }

    /**
     * 延迟到秒的开始
     */
    private fun delayStartOfSecond() {
        val milliStr = System.currentTimeMillis().toString()
        val milli = milliStr.substring(milliStr.length - 3).toLong()
        Thread.sleep((1000 - milli) + 1)
    }

    override fun getCurrentTimeSeconds(): Long {
        return seconds
    }

}

/**
 * 使用系统时间方法获取当前秒
 *
 * @author 思追(shaco)
 */
class SystemTime : Time {
    override fun getCurrentTimeSeconds(): Long {
        return System.currentTimeMillis() / 1000
    }
}
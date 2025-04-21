package cc.shacocloud.greatwall.utils

import kotlinx.coroutines.DelicateCoroutinesApi
import kotlinx.coroutines.GlobalScope
import kotlinx.coroutines.asCoroutineDispatcher
import kotlinx.coroutines.launch
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import java.util.concurrent.CopyOnWriteArrayList
import java.util.concurrent.Executors

/**
 * 高效的获取当前时间的秒数，可以使用不同的实现
 *
 * @author 思追(shaco)
 */
interface Time {

    companion object {

        val DEFAULT: Time = SystemTime()

    }

    /**
     * 获取当前秒戳
     */
    fun getCurrentTimeSeconds(): Long

}

interface TimeUpdateEventListener {

    /**
     * 秒级时间更新
     */
    suspend fun onTimeUpdate(seconds: Long)

}

/**
 * 使用定时器缓存时间
 *
 * @author 思追(shaco)
 */
object TimerCacheTime : Time {

    private val log: Logger = LoggerFactory.getLogger(TimerCacheTime::class.java)

    private val dispatcher = Executors.newFixedThreadPool(2)
        .asCoroutineDispatcher()

    private val eventListeners = CopyOnWriteArrayList<TimeUpdateEventListener>()

    // 当前时间的毫秒戳
    @Volatile
    private var seconds: Long = System.currentTimeMillis() / 1000

    init {
        // 注册关闭
        Runtime.getRuntime().addShutdownHook(Thread { dispatcher.close() })

        // 时间缓存调度
        val runnable = Runnable {
            while (true) {
                try {
                    seconds = System.currentTimeMillis() / 1000

                    // 每秒处理事件
                    @OptIn(DelicateCoroutinesApi::class)
                    GlobalScope.launch(dispatcher) {
                        eventListeners.forEach {
                            launch {
                                it.onTimeUpdate(seconds)
                            }
                        }
                    }

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

    /**
     * 添加事件
     */
    fun addEventListener(listener: TimeUpdateEventListener) {
        eventListeners.add(listener)
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
package cc.shacocloud.greatwall.utils

import java.net.NetworkInterface
import java.nio.ByteBuffer
import java.util.concurrent.atomic.AtomicInteger
import java.util.concurrent.atomic.AtomicReference
import kotlin.random.Random

/**
 * MongoDB ID生成策略实现
 *
 * ObjectId由以下几部分组成：
 *
 * 1. Time 时间戳。
 * 2. Machine 所在主机的唯一标识符，一般是机器主机名的散列值。
 * 3. PID 进程ID。确保同一机器中不冲突
 * 4. INC 自增计数器。确保同一秒内产生objectId的唯一性。
 */
object ObjectId {

    /** 机器信息  */
    private val MACHINE = machinePiece or processPiece

    /** 线程安全的下一个随机数,每次生成自增+1  */
    private val NEXT_INC_REF = AtomicReference(
        currentTimeSeconds() to AtomicInteger(0)
    )

    /**
     * 给定的字符串是否为有效的 ObjectId
     *
     * @param s 字符串
     * @return 是否为有效的 ObjectId
     */
    fun isValid(s: String?): Boolean {
        var str = s ?: return false
        str = str.replace("-", "")
        val len = str.length
        if (len != 24) {
            return false
        }

        var c: Char
        for (i in 0 until len) {
            c = str[i]
            if (c in '0'..'9') {
                continue
            }
            if (c in 'a'..'f') {
                continue
            }
            if (c in 'A'..'F') {
                continue
            }
            return false
        }
        return true
    }

    /**
     * 获取一个objectId用下划线分割
     *
     * @param separator 分隔符
     * @return objectId
     */
    fun next(separator: String = "-"): String {
        val array = nextBytes()
        val buf = StringBuilder()
        var t: Int
        for (i in array.indices) {
            if (i % 4 == 0 && i != 0) {
                buf.append(separator)
            }
            t = array[i].toInt() and 0xff
            if (t < 16) {
                buf.append('0')
            }
            buf.append(Integer.toHexString(t))
        }
        return buf.toString()
    }

    /**
     * 获取一个objectId的bytes表现形式
     *
     * @return objectId
     */
    private fun nextBytes(): ByteArray {
        val bb = ByteBuffer.wrap(ByteArray(12))
        bb.putInt((System.currentTimeMillis() / 1000).toInt()) // 4位
        bb.putInt(MACHINE) // 4位
        bb.putInt(getNextInc().getAndIncrement()) // 4位
        return bb.array()
    }

    /**
     * 获取当前时间的计数器
     */
    private fun getNextInc(): AtomicInteger {
        val (_, nextInc) = NEXT_INC_REF.updateAndGet { prev ->
            val (time, _) = prev
            val currentTime = currentTimeSeconds()
            if (currentTime > time) {
                currentTime to AtomicInteger(0)
            } else {
                prev
            }
        }
        return nextInc
    }

    private fun currentTimeSeconds(): Long {
        return System.currentTimeMillis() / 1000
    }

    // ----------------------------------------------------------------------------------------- 私有方法启动

    /**
     * 获取机器码片段
     *
     * @return 机器码片段
     */
    private val machinePiece: Int
        get() {
            // 机器码
            var machinePiece: Int
            try {
                val netSb = StringBuilder()
                // 返回机器所有的网络接口
                val e = NetworkInterface.getNetworkInterfaces()
                // 遍历网络接口
                while (e.hasMoreElements()) {
                    val ni = e.nextElement()
                    // 网络接口信息
                    netSb.append(ni.toString())
                }
                // 保留后两位
                machinePiece = netSb.toString().hashCode() shl 16
            } catch (e: Throwable) {
                // 出问题随机生成,保留后两位
                machinePiece = (Random.nextInt()) shl 16
            }
            return machinePiece
        }

    /**
     * 获取进程码片段
     *
     * @return 进程码片段
     */
    private val processPiece: Int
        get() {
            // 进程码
            // 因为静态变量类加载可能相同,所以要获取进程ID + 加载对象的ID值
            val processPiece: Int

            // 进程ID初始化
            val processId: Int = try {
                AppUtil.pid
            } catch (t: Throwable) {
                Random.nextInt()
            }

            // 进程ID
            // 保留前2位
            val processSb = Integer.toHexString(processId)
            processPiece = processSb.hashCode() and 0xFFFF

            return processPiece
        }
}

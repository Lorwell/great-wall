package cc.shacocloud.greatwall.utils

import cc.shacocloud.greatwall.utils.Slf4j.Companion.log
import java.util.*
import java.util.concurrent.Executors
import java.util.concurrent.ScheduledFuture
import java.util.concurrent.TimeUnit
import java.util.concurrent.atomic.AtomicBoolean

/**
 * 任务定时器
 *
 * 添加一个任务列表，按照指定的执行时间触发执行，具体的执行时间可能小于指定的时间（时间取决于任务的执行时长），因为内部只使用一个线程执行，任务将优先
 * 根据指定执行时间优先执行，如果相同的执行时间则先加入的先执行。
 *
 * 使用场景：长链接的心跳检查等...
 *
 * @author 思追(shaco)
 */
@Slf4j
class TaskTimer {

    private val scheduledExecutorService = Executors.newScheduledThreadPool(1)
    private val lock = Any()

    private val taskIdMappingNode: MutableMap<String, Node> = HashMap()

    private var firstNode: Node? = null
    private var executionNode: Node? = null
    private var scheduledFuture: ScheduledFuture<*>? = null
    private val isShutdown = AtomicBoolean(false)

    /**
     * 添加任务
     *
     * @param executionTime 任务执行时间戳，毫秒级
     * @param task          执行的任务
     * @return 任务唯一id
     */
    fun saveTask(executionTime: Long, task: Runnable): String {
        return saveTask(ObjectId.next(), executionTime, task)
    }

    /**
     * 添加任务
     *
     * @param taskId        自定义id，如果id存在则会更新对应的任务
     * @param executionTime 任务执行时间戳，毫秒级
     * @param task          执行的任务
     * @return 任务唯一id
     */
    fun saveTask(taskId: String, executionTime: Long, task: Runnable): String {
        check(!isShutdown.get()) { "当前定时器已经停止运行！" }

        require(System.currentTimeMillis() < executionTime) { "执行时间不能小于等于当前时间！" }

        synchronized(lock) {
            // id存在先删除对应的节点信息
            removeTask(taskId)

            val taskObj = TaskObj(taskId, executionTime, task)

            val currentNode: Node
            if (firstNode == null) {
                currentNode = Node(taskObj)
                firstNode = currentNode
            } else {
                // 将当前节点添加到指定位置
                var node = firstNode!!
                while (true) {
                    val item: TaskObj = node.item

                    // 如果执行时间小于节点执行时间则放置在其前一个
                    if (executionTime < item.executionTime) {
                        val nodePrev = node.prev

                        currentNode = Node(taskObj, nodePrev, node)

                        if (nodePrev != null) {
                            nodePrev.next = currentNode
                        }

                        node.prev = currentNode
                        break
                    } else if (node.next == null) {
                        currentNode = Node(taskObj, node)
                        node.next = currentNode
                        break
                    }

                    node = node.next!!
                }

                if (firstNode?.prev != null) {
                    firstNode = firstNode?.prev
                }
            }

            taskIdMappingNode[taskId] = currentNode

            // 刷新任务计划
            refreshTaskScheduled()
            return taskId
        }
    }

    /**
     * 删除任务，如果任务删除成功则返回true，反之为false
     *
     * @param taskId 任务id，[.saveTask]
     */
    fun removeTask(taskId: String) {
        synchronized(lock) {
            val node = taskIdMappingNode.remove(taskId) ?: return

            val nodePrev = node.prev
            val nodeNext = node.next

            if (nodePrev != null) {
                nodePrev.next = nodeNext
            }

            if (nodeNext != null) {
                nodeNext.prev = nodePrev
            }

            if (firstNode == null || firstNode == node) {
                firstNode = nodeNext
            }

            if (executionNode == node) {
                executionNode = null
                scheduledFuture?.cancel(true)
                scheduledFuture = null
            }

            // 刷新任务计划
            refreshTaskScheduled()
        }
    }

    /**
     * 关机，如果当前任务正在执行则中等待其执行结束，反之直接返回所有未执行的任务
     */
    fun shutdown(): List<TaskObj> {
        return shutdown(5, TimeUnit.SECONDS)
    }

    /**
     * 关机，如果当前任务正在执行则中等待其执行结束，反之直接返回所有未执行的任务
     */
    @Throws(InterruptedException::class)
    fun shutdown(timeout: Long, unit: TimeUnit): List<TaskObj> {
        synchronized(lock) {
            isShutdown.set(true)
            scheduledExecutorService.shutdownNow()
            val termination = scheduledExecutorService.awaitTermination(timeout, unit)
            if (!termination) {
                if (log.isWarnEnabled) {
                    log.warn("关闭 TaskTimer 时等待正在执行中的任务完成超时！")
                }
            }

            // 封装为List对象返回
            val list = LinkedList<TaskObj>()
            var node = firstNode
            while (node != null) {
                list.add(node.item)
                node = node.next
            }
            return list
        }
    }

    /**
     * 刷新任务计划表
     */
    private fun refreshTaskScheduled() {
        synchronized(lock) {
            if (isShutdown.get() || firstNode == null) return

            if (executionNode == null || executionNode !== firstNode) {
                executionNode = firstNode

                if (Objects.nonNull(scheduledFuture)) {
                    scheduledFuture!!.cancel(true)
                    scheduledFuture = null
                }

                val item: TaskObj = executionNode!!.item
                val firstExecutionTime: Long = item.executionTime
                val delay: Long = firstExecutionTime - System.currentTimeMillis()

                scheduledFuture = scheduledExecutorService.schedule(
                    TaskExecutor(item, this),
                    if (delay < 0) 0 else delay, TimeUnit.MILLISECONDS
                )
            }
        }
    }

    /**
     * 完成当前任务
     */
    private fun completeCurrentTask() {
        synchronized(lock) {
            scheduledFuture = null
            executionNode = null
            firstNode = firstNode?.next
            refreshTaskScheduled()
        }
    }

    @Slf4j
    private class TaskExecutor(private val taskObj: TaskObj, private val taskTimer: TaskTimer) : Runnable {
        override fun run() {
            try {
                taskObj.task.run()
            } catch (cause: Throwable) {
                if (log.isErrorEnabled) {
                    log.error("TaskTimer 执行任务发生例外！", cause)
                }
            } finally {
                // 执行完成添加下一个任务的定时器
                taskTimer.completeCurrentTask()
            }
        }
    }

    data class Node(
        val item: TaskObj,
        var prev: Node? = null,
        var next: Node? = null,
    ) {

        override fun equals(o: Any?): Boolean {
            if (this === o) return true
            if (o == null || javaClass != o.javaClass) return false
            val node = o as Node
            return item.taskId == node.item.taskId
        }

        override fun hashCode(): Int {
            return Objects.hash(item.taskId)
        }
    }

    data class TaskObj(
        val taskId: String,
        val executionTime: Long,
        val task: Runnable
    )
}

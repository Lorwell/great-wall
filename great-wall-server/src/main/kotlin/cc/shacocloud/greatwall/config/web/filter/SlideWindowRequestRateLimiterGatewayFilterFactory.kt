package cc.shacocloud.greatwall.config.web.filter

import cc.shacocloud.greatwall.config.web.MainServerErrorHandler
import cc.shacocloud.greatwall.model.constant.WindowUnit
import cc.shacocloud.greatwall.utils.Time
import cc.shacocloud.greatwall.utils.toDuration
import kotlinx.coroutines.sync.Mutex
import org.slf4j.Logger
import org.slf4j.LoggerFactory
import org.springframework.stereotype.Component
import reactor.core.publisher.Mono
import reactor.util.retry.Retry
import java.time.Duration
import java.util.concurrent.atomic.AtomicBoolean
import java.util.concurrent.atomic.AtomicReference
import java.util.concurrent.atomic.AtomicReferenceArray
import java.util.concurrent.atomic.LongAdder

/**
 * 滑动窗口算法速率限制器
 *
 * @author 思追(shaco)
 */
@Component
class SlideWindowRequestRateLimiterGatewayFilterFactory(
    mainServerErrorHandler: MainServerErrorHandler,
) : AbstractRequestRateLimiterGatewayFilterFactory<SlideWindowRequestRateLimiterGatewayFilterFactory.Config>(
    Config::class.java,
    mainServerErrorHandler
) {

    class Config : AbstractRequestRateLimiterGatewayFilterFactory.Config() {

        /**
         * 请求限制数量
         */
        var limit: Int = 10000

        /**
         * 窗口大小
         */
        var window: Int = 1

        /**
         * 窗口单位
         */
        var windowUnit: WindowUnit = WindowUnit.SECONDS

        /**
         * 窗口数量
         */
        var size: Int = 60

    }

    override fun getRateLimiter(config: Config): RateLimiter {
        require(config.limit > 0) { "令牌数量必须大于0" }
        require(config.window > 0) { "窗口值必须大于0" }
        require(config.size > 0) { "窗口数量必须大于0" }

        return SlideWindowRateLimiter(config)
    }

    /**
     * 滑动窗口速率限制器
     */
    class SlideWindowRateLimiter(val config: Config) : RateLimiter {

        companion object {
            private val log: Logger = LoggerFactory.getLogger(SlideWindowRateLimiter::class.java)
        }

        // 存储桶长度
        private val numberOfBuckets = config.size

        // 存储桶间隔时间
        private val bucketInterval = config.window.toDuration(config.windowUnit.unit).toSeconds()

        // 总的窗口时间  bucketIntervalMs * numberOfBuckets
        private val windowTime = bucketInterval * numberOfBuckets

        // 请求限流
        private val limit = config.limit

        private val updateLock = Mutex()
        private val time: Time = Time.DEFAULT

        // 用于记录当前所有桶的总并发
        private val total: LongAdder = LongAdder()

        // 这是一个充当 FIFO 队列的环形数组
        private val state = AtomicReference(
            ListState(
                // 空间额外 +1，用于来作为 add/remove 方法的额外空间
                data = AtomicReferenceArray<Bucket>(numberOfBuckets + 1),
                dataLength = numberOfBuckets + 1,
                numberOfBuckets = numberOfBuckets,
                head = 0,
                tail = 0
            )
        )

        override fun run(handler: (allowed: Boolean) -> Mono<Void>): Mono<Void> {
            return getCurrentBucket()
                .map {
                    if (total.sum() + 1 > limit) {
                        false
                    } else {
                        it.increment()
                        true
                    }
                }
                .flatMap { handler(it) }
        }

        /**
         *  @see ListState.getArray
         */
        fun getBuckets(): Array<Bucket> {
            return state.get().getArray()
        }

        /**
         * 获取当前存储桶
         */
        private fun getCurrentBucket(): Mono<Bucket> {
            val currentTime = time.getCurrentTimeSeconds()

            var currentBucket = peekLast()

            // 在当前的时间窗口内则立即返回
            if (currentBucket != null && currentTime < currentBucket.end) {
                return Mono.just(currentBucket)
            }

            // 使用锁来更新桶，在并发的情况下只有一个线程将触发更新，其他的将继续使用之前 currentBucket
            // 这样可以使吞吐量大大的提高，而且只会拖慢一个线程的速度
            if (updateLock.tryLock()) {
                try {
                    currentBucket = peekLast()
                    // 当前队列为空，则创建第一个存储桶
                    if (currentBucket == null) {
                        val newBucket = Bucket(
                            start = currentTime,
                            end = currentTime + bucketInterval,
                            total = total
                        )
                        addLast(newBucket)
                        return Mono.just(newBucket)
                    }

                    // 使用循环去创建更多的存储桶，以赶上现在的时间
                    for (i in 0 until numberOfBuckets) {
                        val lastBucket = requireNotNull(peekLast())

                        // 在当前的时间窗口内则立即返回
                        if (currentTime < lastBucket.end) {
                            return Mono.just(lastBucket)
                        }
                        // 已过时间大于整个滚动计数器的时间，从头开始
                        else if (currentTime - lastBucket.end > windowTime) {
                            clear()

                            // 清空后添加一个新的桶
                            val newBucket = Bucket(
                                start = currentTime,
                                end = currentTime + bucketInterval,
                                total = total
                            )
                            addLast(newBucket)
                            return Mono.just(newBucket)
                        }
                        // 已经过滤当前的窗口期，获取一个新的存储桶
                        else {
                            addLast(
                                Bucket(
                                    start = currentTime,
                                    end = currentTime + bucketInterval,
                                    total = total
                                )
                            )
                        }
                    }

                    // 完成创建，返回最新的存储桶
                    return Mono.just(requireNotNull(peekLast()))
                } finally {
                    updateLock.unlock()
                }
            }
            // 未获取到锁
            else {
                currentBucket = peekLast()
                return if (currentBucket != null) Mono.just(currentBucket)
                // 在极端情况下多个线程争取第一个桶的创建
                else {
                    Mono.fromSupplier { requireNotNull(peekLast()) }
                        .retryWhen(Retry.backoff(20, Duration.ofMillis(5)))
                }
            }
        }

        /**
         * 获取最后一个桶信息
         */
        private fun peekLast(): Bucket? {
            return state.get().tail()
        }

        /**
         * 在尾部添加一个桶
         *
         * 理论上，可以允许2个及以上的线程同时进行 addLast 操作，这种复合操作会交错进行。
         * 而实际上这种情况不应该发生，因为 getCurrentBucket 应该由单线程执行。
         */
        private fun addLast(
            bucket: Bucket,
        ) {
            val currentState = state.get()

            // 创建新版本的状态（我们希望它成为什么样的状态）
            val newState = currentState.addBucket(bucket)

            // 使用 compareAndSet 进行设置，以防多个线程正在尝试
            // 这种情况应该不会发生，因为由于 getCurrentBucket 中提供的保护，addLast 一次只能被一个线程调用
            if (state.compareAndSet(currentState, newState)) {
                return
            }

            if (log.isTraceEnabled) {
                log.trace(
                    "SlideWindowRateLimiter 更新 state 失败，存在其他线程正在更新，这是预期之外的，" +
                        "与其冒着进行多个 addLast 的风险，不如这里直接返回让其他线程获胜，在下一次 getCurrentBucket 时就能解决问题"
                )
            }
        }

        /**
         * 清空环形队列
         */
        private fun clear() {
            while (true) {
                val current = state.get()
                val newState = current.createNew()
                if (state.compareAndSet(current, newState)) {
                    total.reset()
                    return
                }
            }
        }

        class ListState(
            // 这是一个 AtomicReferenceArray，而不是一个普通的数组，因为我们要在 ListState 对象之间复制引用
            // 而多个线程可能会在这些复合操作中维护引用，因此需要可见性/并发性保证
            val data: AtomicReferenceArray<Bucket>,
            val dataLength: Int,
            val numberOfBuckets: Int,
            val head: Int, // 头指针
            val tail: Int, // 尾指针
        ) {
            private val size = if (head == 0 && tail == 0) 0 else (tail + dataLength - head) % dataLength

            /**
             * 获取尾部的桶
             */
            fun tail(): Bucket? {
                return if (size == 0) null else data[convert(size - 1)]
            }

            /**
             * 获取头部的桶
             */
            fun head(): Bucket? {
                return if (size == 0) null else data[convert(0)]
            }

            fun addBucket(
                bucket: Bucket,
            ): ListState {
                data[tail] = bucket
                return incrementTail()
            }

            /**
             * 即创建一个新的对象空返回
             */
            fun createNew(): ListState {
                val data = AtomicReferenceArray<Bucket>(dataLength)
                return ListState(
                    data = data,
                    dataLength = dataLength,
                    numberOfBuckets = numberOfBuckets,
                    head = 0,
                    tail = 0
                )
            }

            /**
             * 获取 bucket 数组
             *
             * 这在技术上不是线程安全的，因为它需要对可以更改的内容进行多次读取，但由于我们从不直接清除数据，
             * 我们永远不会得到 NULL，只是可能会返回陈旧的数据
             */
            fun getArray(): Array<Bucket> {
                return Array(size) {
                    data[convert(it)]
                }
            }

            private fun incrementTail(): ListState {
                // 如果递增的结果大于 "length"，也就是我们应该达到的最大值，那么也递增 head（相当于 removeFirst，但以原子方式完成）
                return if (size == numberOfBuckets) {
                    data[convert(0)].close()
                    // 增加尾部和头部
                    ListState(data, dataLength, numberOfBuckets, (head + 1) % dataLength, (tail + 1) % dataLength)
                } else {
                    // 仅增加尾部
                    ListState(data, dataLength, numberOfBuckets, head, (tail + 1) % dataLength)
                }
            }

            //  采用逻辑索引（就好像 head 始终为 0）并在 elementData 中计算索引
            private fun convert(index: Int): Int {
                return (index + head) % dataLength
            }
        }

        data class Bucket(

            /**
             * 当前桶的开始时间戳
             */
            val start: Long,

            /**
             * 当前桶的结束时间戳
             */
            val end: Long,

            /**
             * 用于记录当前所有桶的总并发
             */
            private val total: LongAdder,
        ) {

            /**
             * 当前桶的统计
             */
            private val count: LongAdder = LongAdder()

            private val close = AtomicBoolean(false)

            /**
             * 增加一次计数
             */
            fun increment() {
                require(!close.get()) { "当前 bucket 已经被关闭！" }
                count.increment()
                total.increment()
            }

            /**
             * 当前统计值
             */
            fun currentValue(): Long {
                return count.sum()
            }

            /**
             * 关闭
             */
            fun close() {
                if (!close.getAndSet(true)) {
                    total.add(-count.sum())
                }
            }

            override fun toString(): String {
                return "Bucket(start=$start, end=$end, total=$total, count=$count)"
            }

        }
    }
}
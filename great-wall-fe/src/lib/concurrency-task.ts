export type Task = (resolve: Function, reject: Function, ...args: Array<any>) => any;
export type ResultCallback = () => any;

/**
 * 并发任务队列
 */
class ConcurrencyTask {

    /**
     * 任务集合
     */
    private taskList: Array<Task> = [];

    /**
     * 是否正在执行任务
     */
    private running: boolean = false;

    /**
     * 最大并发数
     */
    private maxConcurrency: number = ConcurrencyTask.DEFAULT_MAX_CONCURRENCY;

    /**
     * 默认的最大并发数
     */
    private static DEFAULT_MAX_CONCURRENCY: number = 2;

    /**
     * 当前任务索引
     */
    private taskIndex: number = 0;

    /**
     * 用 promise 包裹任务
     */
    private taskPromiseList: Array<Promise<void>> = [];

    /**
     * 是否可中断
     */
    private canAbort: boolean = false;

    /**
     * 执行结束
     */
    private runOver: boolean = false;

    /**
     * 任务全部执行完毕时的回调函数
     */
    private runOverCallback: ResultCallback = () => {
    };

    /**
     * 创建并发任务队列
     * @param maxConcurrency 最大并发数
     * @param runOverCallback 任务全部执行完毕后的回调
     */
    public constructor(maxConcurrency: number = ConcurrencyTask.DEFAULT_MAX_CONCURRENCY,
                       runOverCallback: ResultCallback) {
        this.setRunOverCallback(runOverCallback);
        this.setMaxConcurrency(maxConcurrency);
        this.initial();
    }

    private initial(): void {
        this.canAbort = false;
        this.reset();
    }

    /**
     * 添加任务到任务队列, 不会执行
     * @param task 任务
     * @return 是否添加成功, 如果任务处于执行阶段返回 false
     */
    public addTask(task: Task): boolean {
        if (!this.getRunning()) {
            this.taskList.push(task);
            return true;
        }
        return false;
    }

    /**
     * 开始运行任务
     * @param canAbort 是否可中断
     * @param args 任务执行参数
     */
    public run(canAbort: boolean = false, ...args: Array<any>): void {
        this.canAbort = canAbort;
        this.setRunning(true);
        let length = this.taskList.length;
        let maxConcurrency = Math.min(this.getMaxConcurrency(), length);
        for (let index = 0; index < maxConcurrency; index++) {
            this.executeSingleTask(args);
        }
    }

    /**
     * 执行单个任务
     * @param args 函数执行参数
     */
    private executeSingleTask(...args: Array<any>): void {
        if (this.taskIndex >= this.taskList.length) {
            this.judgeExecuteEnd(args);
            return
        }

        const task = this.taskList[this.taskIndex];
        this.taskIndex++;

        const promise = new Promise<void>((resolve, reject) => task(resolve, reject, args));

        promise.then(() => {
            this.judgeExecuteEnd(args);
        }).catch((error) => {
            console.error("执行任务发生例外！", error);

            // 如果可以中断任务的执行, 则重置任务队列
            if (this.canAbort) {
                this.reset();
                return;
            } else {
                this.judgeExecuteEnd(args);
            }
        });

        this.taskPromiseList.push(promise);
    }

    /**
     * 判断是否执行结束
     * @param args 函数执行所需参数
     */
    private judgeExecuteEnd(args: Array<any>): void {
        // 如果全部任务都得到执行, 并且执行没有结束
        // 设置 runOver 的原因是最后几个并发执行的任务在执行完毕后都会
        // 触发该函数, 而 runOverCallback 函数应只执行一次
        if (this.taskIndex >= this.taskList.length) {
            if (!this.runOver) {
                this.runOver = true;
                Promise.all(this.taskPromiseList)
                    .then(() => {
                        this.runOverCallback();
                    })
                    .catch(() => {
                        if (!this.canAbort) {
                            this.runOverCallback();
                        }
                    });

                this.reset();
            }
            return;
        }

        this.executeSingleTask(args);
    }

    private reset(): void {
        this.taskList = [];
        this.taskIndex = 0;
        this.taskPromiseList = [];
        this.running = false;
    }

    private setRunning(running: boolean): void {
        this.running = running;
    }

    public getRunning(): boolean {
        return this.running;
    }

    /**
     * 设置任务全部执行完毕后的回调函数, 如果队列正在执行则返回 false
     * @param runOverCallback 回调函数
     */
    public setRunOverCallback(runOverCallback: ResultCallback): boolean {
        if (!this.getRunning()) {
            this.runOverCallback = runOverCallback;
            return true;
        }
        return false;
    }

    /**
     * 设置最大并发数, 如果正在执行返回 false
     * @param maxConcurrency 最大并发数, 小于等于 0 时使用默认值
     */
    public setMaxConcurrency(maxConcurrency: number): boolean {
        if (maxConcurrency <= 0) {
            this.maxConcurrency = ConcurrencyTask.DEFAULT_MAX_CONCURRENCY;
        }
        if (!this.getRunning()) {
            this.maxConcurrency = maxConcurrency;
            return true;
        }
        return false;
    }

    public getMaxConcurrency(): number {
        return this.maxConcurrency;
    }
}

export default ConcurrencyTask
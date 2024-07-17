import {Get, PostJson} from "@/constant/api";
import {
  CpuLineRecordOutputSchema,
  GcLineMetricsRecordSchema,
  LoadedClassLineRecordOutputSchema,
  MemoryLineRecordOutputSchema,
  MemoryOutputSchema,
  ProcessCpuOutputSchema,
  ThreadLineRecordOutputSchema,
  ThreadTotalOutputSchema,
  UptimeOutputSchema
} from "@/constant/api/monitor-metrics/system-metrics/schema.ts";
import {
  CpuLineRecordOutput,
  GcLineRecordOutput,
  LoadedClassLineRecordOutput,
  MemoryLineRecordOutput,
  MemoryOutput,
  ProcessCpuOutput,
  SystemLineMetricsInput,
  ThreadLineRecordOutput,
  ThreadTotalOutput,
  UptimeOutputMetrics
} from "@/constant/api/monitor-metrics/system-metrics/types.ts";

/**
 * 系统运行时间指标
 */
export function upTimeMetrics(): Promise<UptimeOutputMetrics> {
  return Get(`/api/system-monitor-metrics/up-time`, {
    resultSchema: UptimeOutputSchema
  })
}

/**
 * 进程cpu指标
 */
export function processCpuMetrics(): Promise<ProcessCpuOutput> {
  return Get(`/api/system-monitor-metrics/process-cpu`, {
    resultSchema: ProcessCpuOutputSchema
  })
}

/**
 * 堆内存指标
 */
export function headMemoryMetrics(): Promise<MemoryOutput> {
  return Get(`/api/system-monitor-metrics/head-memory`, {
    resultSchema: MemoryOutputSchema
  })
}

/**
 * 非堆内存指标
 */
export function nonHeadMemoryMetrics(): Promise<MemoryOutput> {
  return Get(`/api/system-monitor-metrics/non-head-memory`, {
    resultSchema: MemoryOutputSchema
  })
}

/**
 * 直接内存指标
 */
export function directMemoryMetrics(): Promise<MemoryOutput> {
  return Get(`/api/system-monitor-metrics/direct-head-memory`, {
    resultSchema: MemoryOutputSchema
  })
}

/**
 * 线程总计指标
 */
export function threadTotalMetrics(): Promise<ThreadTotalOutput> {
  return Get(`/api/system-monitor-metrics/thread-total`, {
    resultSchema: ThreadTotalOutputSchema
  })
}


/**
 * 堆内存折线图指标
 *
 * @param input
 */
export function headMemoryLineMetrics(input: SystemLineMetricsInput): Promise<MemoryLineRecordOutput> {
  return PostJson(`/api/system-monitor-metrics/line/head-memory`, {
    body: input,
    resultSchema: MemoryLineRecordOutputSchema
  })
}

/**
 * 非堆内存折线图指标
 *
 * @param input
 */
export function nonHeadMemoryLineMetrics(input: SystemLineMetricsInput): Promise<MemoryLineRecordOutput> {
  return PostJson(`/api/system-monitor-metrics/line/non-head-memory`, {
    body: input,
    resultSchema: MemoryLineRecordOutputSchema
  })
}

/**
 * 直接内存折线图指标
 *
 * @param input
 */
export function directMemoryLineMetrics(input: SystemLineMetricsInput): Promise<MemoryLineRecordOutput> {
  return PostJson(`/api/system-monitor-metrics/line/direct-memory`, {
    body: input,
    resultSchema: MemoryLineRecordOutputSchema
  })
}

/**
 * cpu折线图指标
 *
 * @param input
 */
export function cpuLineMetrics(input: SystemLineMetricsInput): Promise<CpuLineRecordOutput> {
  return PostJson(`/api/system-monitor-metrics/line/cpu`, {
    body: input,
    resultSchema: CpuLineRecordOutputSchema
  })
}

/**
 * 线程折线图指标
 *
 * @param input
 */
export function threadLineMetrics(input: SystemLineMetricsInput): Promise<ThreadLineRecordOutput> {
  return PostJson(`/api/system-monitor-metrics/line/thread`, {
    body: input,
    resultSchema: ThreadLineRecordOutputSchema
  })
}

/**
 * 类加载折线图指标
 *
 * @param input
 */
export function loadedClassLineMetrics(input: SystemLineMetricsInput): Promise<LoadedClassLineRecordOutput> {
  return PostJson(`/api/system-monitor-metrics/line/loaded-class`, {
    body: input,
    resultSchema: LoadedClassLineRecordOutputSchema
  })
}

/**
 * gc统计折线图指标
 *
 * @param input
 */
export function gcCountLineMetrics(input: SystemLineMetricsInput): Promise<GcLineRecordOutput> {
  return PostJson(`/api/system-monitor-metrics/line/gc-count`, {
    body: input,
    resultSchema: GcLineMetricsRecordSchema
  })
}

/**
 * gc 时间折线图指标
 *
 * @param input
 */
export function gcTimeLineMetrics(input: SystemLineMetricsInput): Promise<GcLineRecordOutput> {
  return PostJson(`/api/system-monitor-metrics/line/gc-time`, {
    body: input,
    resultSchema: GcLineMetricsRecordSchema
  })
}
import {Get} from "@/constant/api";
import {
  MemoryOutputSchema,
  ProcessCpuOutputSchema,
  ThreadTotalOutputSchema,
  UptimeOutputSchema
} from "@/constant/api/monitor-metrics/system-metrics/schema.ts";
import {
  MemoryOutput,
  ProcessCpuOutput,
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
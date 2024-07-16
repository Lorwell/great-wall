import {
  MemoryOutputMetricsValues,
  ProcessCpuOutputMetricsValues,
  ThreadTotalOutputMetricsValues,
  UptimeOutputMetricsValues
} from "@/constant/api/monitor-metrics/system-metrics/schema.ts";

export type UptimeOutputMetrics = UptimeOutputMetricsValues
export type ProcessCpuOutput = ProcessCpuOutputMetricsValues
export type MemoryOutput = MemoryOutputMetricsValues
export type ThreadTotalOutput = ThreadTotalOutputMetricsValues
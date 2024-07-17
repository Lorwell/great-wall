import {
  CpuLineRecordOutputMetricsValues,
  GcLineMetricsRecordValues,
  LoadedClassLineRecordOutputMetricsValues,
  MemoryLineRecordOutputMetricsValues,
  MemoryOutputMetricsValues,
  ProcessCpuOutputMetricsValues,
  ThreadLineRecordOutputMetricsValues,
  ThreadTotalOutputMetricsValues,
  UptimeOutputMetricsValues
} from "@/constant/api/monitor-metrics/system-metrics/schema.ts";
import {LineMetricsInput} from "@/constant/api/monitor-metrics/types.ts";

export type SystemLineMetricsInput = LineMetricsInput

export type UptimeOutputMetrics = UptimeOutputMetricsValues
export type ProcessCpuOutput = ProcessCpuOutputMetricsValues
export type MemoryOutput = MemoryOutputMetricsValues
export type ThreadTotalOutput = ThreadTotalOutputMetricsValues
export type MemoryLineRecordOutput = MemoryLineRecordOutputMetricsValues
export type CpuLineRecordOutput = CpuLineRecordOutputMetricsValues
export type ThreadLineRecordOutput = ThreadLineRecordOutputMetricsValues
export type LoadedClassLineRecordOutput = LoadedClassLineRecordOutputMetricsValues
export type GcLineRecordOutput = GcLineMetricsRecordValues
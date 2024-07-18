import {z} from "zod";
import {getRecordSchema} from "@/constant/api/schema.ts";

export const UptimeOutputSchema = z.object({
  startTime: z.string({required_error: "不可以为空"}),
  upTime: z.string({required_error: "不可以为空"})
})
export type UptimeOutputMetricsValues = z.infer<typeof UptimeOutputSchema>

export const ProcessCpuOutputSchema = z.object({
  processCpuLoad: z.string({required_error: "不可以为空"}),
})
export type ProcessCpuOutputMetricsValues = z.infer<typeof ProcessCpuOutputSchema>

export const MemoryOutputSchema = z.object({
  value: z.string({required_error: "不可以为空"}),
})
export type MemoryOutputMetricsValues = z.infer<typeof MemoryOutputSchema>

export const ThreadTotalOutputSchema = z.object({
  value: z.number({required_error: "不可以为空"}),
})
export type ThreadTotalOutputMetricsValues = z.infer<typeof ThreadTotalOutputSchema>

export const MemoryLineOutputSchema = z.object({
  unit: z.string({required_error: "不可以为空"}),
  use: z.number().optional().nullable(),
  committed: z.number().optional().nullable(),
  max: z.number().optional().nullable(),
})

export const MemoryLineRecordOutputSchema = getRecordSchema(MemoryLineOutputSchema);
export type MemoryLineRecordOutputMetricsValues = z.infer<typeof MemoryLineRecordOutputSchema>

export const CpuLineOutputSchema = z.object({
  unit: z.string({required_error: "不可以为空"}),
  cpuLoad: z.number().optional().nullable(),
  processCpuLoad: z.number().optional().nullable(),
})

export const CpuLineRecordOutputSchema = getRecordSchema(CpuLineOutputSchema);
export type CpuLineRecordOutputMetricsValues = z.infer<typeof CpuLineRecordOutputSchema>

export const ThreadLineOutputSchema = z.object({
  unit: z.string({required_error: "不可以为空"}),
  new: z.number().optional().nullable(),
  runnable: z.number().optional().nullable(),
  blocked: z.number().optional().nullable(),
  waiting: z.number().optional().nullable(),
  timedWaiting: z.number().optional().nullable(),
  terminated: z.number().optional().nullable(),
})

export const ThreadLineRecordOutputSchema = getRecordSchema(ThreadLineOutputSchema);
export type ThreadLineRecordOutputMetricsValues = z.infer<typeof ThreadLineRecordOutputSchema>

export const LoadedClassLineOutputSchema = z.object({
  unit: z.string({required_error: "不可以为空"}),
  total: z.number().optional().nullable(),
  count: z.number().optional().nullable(),
  unloaded: z.number().optional().nullable()
})

export const LoadedClassLineRecordOutputSchema = getRecordSchema(LoadedClassLineOutputSchema);
export type LoadedClassLineRecordOutputMetricsValues = z.infer<typeof LoadedClassLineRecordOutputSchema>


export const GcMappingSchema = z.object({
  label: z.string({required_error: "不可以为空"}),
  key: z.string({required_error: "不可以为空"})
})

const GcDataSchema = z.record(
  z.string({required_error: "不可以为空"}),
  z.union([z.string({required_error: "不可以为空"}), z.number({required_error: "不可以为空"})])
);

export const GcLineMetricsRecordSchema = z.object({
  mapping: z.array(GcMappingSchema),
  data: z.array(GcDataSchema)
})

export type GcLineMetricsRecordValues = z.infer<typeof GcLineMetricsRecordSchema>
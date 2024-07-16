import {z} from "zod";

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
import {z} from "zod";
import {getRecordSchema} from "@/constant/api/schema.ts";

export const CountMetricsSchema = z.object({
  value: z.number({required_error: "不可以为空"})
})
export type CountMetricsValues = z.infer<typeof CountMetricsSchema>

export const LineValueMetricsSchema = z.object({
  unit: z.string({required_error: "不可以为空"}),
  value: z.number({required_error: "不可以为空"})
})

export const LineMetricsRecordSchema = getRecordSchema(LineValueMetricsSchema)
export type LineMetricsRecordValues = z.infer<typeof LineMetricsRecordSchema>

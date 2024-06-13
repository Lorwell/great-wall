import {z} from "zod";
import {getRecordSchema} from "@/constant/api/schema.ts";

export const CountMetricsSchema = z.object({
  value: z.number({required_error: "不可以为空"})
})
export type CountMetricsValues = z.infer<typeof CountMetricsSchema>

export const QpsLineValueMetricsSchema = z.object({
  unit: z.string({required_error: "不可以为空"}),
  value: z.number({required_error: "不可以为空"})
})

export const QpsLineMetricsRecordSchema = getRecordSchema(QpsLineValueMetricsSchema)
export type QpsLineMetricsRecordValues = z.infer<typeof QpsLineMetricsRecordSchema>


export const DurationLineValueMetricsSchema = z.object({
  unit: z.string({required_error: "不可以为空"}),
  avgValue: z.number({required_error: "不可以为空"}),
  maxValue: z.number({required_error: "不可以为空"}),
})

export const DurationLineMetricsRecordSchema = getRecordSchema(DurationLineValueMetricsSchema)
export type DurationLineMetricsRecordValues = z.infer<typeof DurationLineMetricsRecordSchema>

export const TopQpsLineValueMetricsSchema = z.object({
  api: z.string({required_error: "不可以为空"}),
  data: z.array(QpsLineValueMetricsSchema)
})


export const TopQpsLineMetricsRecordSchema = getRecordSchema(TopQpsLineValueMetricsSchema)
export type TopQpsLineMetricsRecordValues = z.infer<typeof TopQpsLineMetricsRecordSchema>
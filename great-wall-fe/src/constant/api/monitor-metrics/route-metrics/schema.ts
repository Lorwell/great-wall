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


export const TopQpsApiKeyMappingSchema = z.object({
  label: z.string({required_error: "不可以为空"}),
  key: z.string({required_error: "不可以为空"})
})

const TopQpsDataSchema = z.record(
  z.string({required_error: "不可以为空"}),
  z.union([z.string({required_error: "不可以为空"}), z.number({required_error: "不可以为空"})])
);


export const TopQpsLineMetricsRecordSchema = z.object({
  mapping: z.array(TopQpsApiKeyMappingSchema),
  data: z.array(TopQpsDataSchema)
})
export type TopQpsLineMetricsRecordValues = z.infer<typeof TopQpsLineMetricsRecordSchema>
import {z} from "zod";

export const CountMetricsSchema = z.object({
  value: z.number({required_error: "不可以为空"})
})
export type CountMetricsValues = z.infer<typeof CountMetricsSchema>

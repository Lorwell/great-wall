import {z} from "zod";

export const RouteMonitorMetricsSchema = z.object({
  value: z.number({required_error: "不可以为空"})
})
export type RouteMonitorMetricsValues = z.infer<typeof RouteMonitorMetricsSchema>

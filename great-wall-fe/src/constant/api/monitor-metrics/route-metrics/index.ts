import {
  RouteMonitorMetricsInput,
  RouteMonitorMetricsOutput
} from "@/constant/api/monitor-metrics/route-metrics/types.ts";
import {Get} from "@/constant/api";
import {RouteMonitorMetricsSchema} from "@/constant/api/monitor-metrics/route-metrics/schema.ts";

/**
 * 请求统计指标
 * @param input
 */
export function requestCountMetrics(input: RouteMonitorMetricsInput): Promise<RouteMonitorMetricsOutput> {
  return Get(`/api/route-monitor-metrics/request-count`, {
    queryParam: input,
    resultSchema: RouteMonitorMetricsSchema
  })
}
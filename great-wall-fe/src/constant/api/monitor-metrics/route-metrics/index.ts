import {CountMetricsOutput, RouteMonitorMetricsInput} from "@/constant/api/monitor-metrics/route-metrics/types.ts";
import {Get} from "@/constant/api";
import {CountMetricsSchema} from "@/constant/api/monitor-metrics/route-metrics/schema.ts";

/**
 * 请求统计指标
 * @param input
 */
export function requestCountMetrics(input: RouteMonitorMetricsInput): Promise<CountMetricsOutput> {
  return Get(`/api/route-monitor-metrics/count/request`, {
    queryParam: input,
    resultSchema: CountMetricsSchema
  })
}

/**
 * ip统计指标
 * @param input
 */
export function ipCountMetrics(input: RouteMonitorMetricsInput): Promise<CountMetricsOutput> {
  return Get(`/api/route-monitor-metrics/count/ip`, {
    queryParam: input,
    resultSchema: CountMetricsSchema
  })
}
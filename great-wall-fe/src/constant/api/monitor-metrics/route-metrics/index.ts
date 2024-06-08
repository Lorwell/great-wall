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

/**
 * 请求流量指标
 * @param input
 */
export function requestTrafficSumMetrics(input: RouteMonitorMetricsInput): Promise<CountMetricsOutput> {
  return Get(`/api/route-monitor-metrics/sum/request-traffic`, {
    queryParam: input,
    resultSchema: CountMetricsSchema
  })
}

/**
 * 响应流量指标
 * @param input
 */
export function responseTrafficSumMetrics(input: RouteMonitorMetricsInput): Promise<CountMetricsOutput> {
  return Get(`/api/route-monitor-metrics/sum/response-traffic`, {
    queryParam: input,
    resultSchema: CountMetricsSchema
  })
}

/**
 * 4xx响应状态码指标
 * @param input
 */
export function status4xxCountMetrics(input: RouteMonitorMetricsInput): Promise<CountMetricsOutput> {
  return Get(`/api/route-monitor-metrics/count/status-4xx`, {
    queryParam: input,
    resultSchema: CountMetricsSchema
  })
}

/**
 * 5xx响应状态码指标
 * @param input
 */
export function status5xxCountMetrics(input: RouteMonitorMetricsInput): Promise<CountMetricsOutput> {
  return Get(`/api/route-monitor-metrics/count/status-5xx`, {
    queryParam: input,
    resultSchema: CountMetricsSchema
  })
}
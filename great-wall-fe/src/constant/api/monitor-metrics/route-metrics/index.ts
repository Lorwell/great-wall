import {
  CountMetricsOutput,
  LineMetricsRecordOutput,
  RouteCountMetricsInput,
  RouteLineMetricsInput
} from "@/constant/api/monitor-metrics/route-metrics/types.ts";
import {Get} from "@/constant/api";
import {CountMetricsSchema, LineMetricsRecordSchema} from "@/constant/api/monitor-metrics/route-metrics/schema.ts";

/**
 * 请求统计指标
 * @param input
 */
export function requestCountMetrics(input: RouteCountMetricsInput): Promise<CountMetricsOutput> {
  return Get(`/api/route-monitor-metrics/count/request`, {
    queryParam: input,
    resultSchema: CountMetricsSchema
  })
}

/**
 * ip统计指标
 * @param input
 */
export function ipCountMetrics(input: RouteCountMetricsInput): Promise<CountMetricsOutput> {
  return Get(`/api/route-monitor-metrics/count/ip`, {
    queryParam: input,
    resultSchema: CountMetricsSchema
  })
}

/**
 * 请求流量指标
 * @param input
 */
export function requestTrafficSumMetrics(input: RouteCountMetricsInput): Promise<CountMetricsOutput> {
  return Get(`/api/route-monitor-metrics/sum/request-traffic`, {
    queryParam: input,
    resultSchema: CountMetricsSchema
  })
}

/**
 * 响应流量指标
 * @param input
 */
export function responseTrafficSumMetrics(input: RouteCountMetricsInput): Promise<CountMetricsOutput> {
  return Get(`/api/route-monitor-metrics/sum/response-traffic`, {
    queryParam: input,
    resultSchema: CountMetricsSchema
  })
}

/**
 * 4xx响应状态码指标
 * @param input
 */
export function status4xxCountMetrics(input: RouteCountMetricsInput): Promise<CountMetricsOutput> {
  return Get(`/api/route-monitor-metrics/count/status-4xx`, {
    queryParam: input,
    resultSchema: CountMetricsSchema
  })
}

/**
 * 5xx响应状态码指标
 * @param input
 */
export function status5xxCountMetrics(input: RouteCountMetricsInput): Promise<CountMetricsOutput> {
  return Get(`/api/route-monitor-metrics/count/status-5xx`, {
    queryParam: input,
    resultSchema: CountMetricsSchema
  })
}

/**
 * qps 折线图指标
 * @param input
 */
export function qpsLineMetrics(input: RouteLineMetricsInput): Promise<LineMetricsRecordOutput> {
  return Get(`/api/route-monitor-metrics/line/qps`, {
    queryParam: input,
    resultSchema: LineMetricsRecordSchema
  })
}
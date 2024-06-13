import {
  CountMetricsOutput,
  DurationLineMetricsRecordOutput,
  QpsLineMetricsRecordOutput,
  RouteCountMetricsInput,
  RouteLineMetricsInput,
  TopQpsLineMetricsRecordOutput,
  TopRouteLineMetricsInput
} from "@/constant/api/monitor-metrics/route-metrics/types.ts";
import {PostJson} from "@/constant/api";
import {
  CountMetricsSchema,
  DurationLineMetricsRecordSchema,
  QpsLineMetricsRecordSchema,
  TopQpsLineMetricsRecordSchema
} from "@/constant/api/monitor-metrics/route-metrics/schema.ts";

/**
 * 请求统计指标
 * @param input
 */
export function requestCountMetrics(input: RouteCountMetricsInput): Promise<CountMetricsOutput> {
  return PostJson(`/api/route-monitor-metrics/count/request`, {
    body: input,
    resultSchema: CountMetricsSchema
  })
}

/**
 * ip统计指标
 * @param input
 */
export function ipCountMetrics(input: RouteCountMetricsInput): Promise<CountMetricsOutput> {
  return PostJson(`/api/route-monitor-metrics/count/ip`, {
    body: input,
    resultSchema: CountMetricsSchema
  })
}

/**
 * 请求流量指标
 * @param input
 */
export function requestTrafficSumMetrics(input: RouteCountMetricsInput): Promise<CountMetricsOutput> {
  return PostJson(`/api/route-monitor-metrics/sum/request-traffic`, {
    body: input,
    resultSchema: CountMetricsSchema
  })
}

/**
 * 响应流量指标
 * @param input
 */
export function responseTrafficSumMetrics(input: RouteCountMetricsInput): Promise<CountMetricsOutput> {
  return PostJson(`/api/route-monitor-metrics/sum/response-traffic`, {
    body: input,
    resultSchema: CountMetricsSchema
  })
}

/**
 * 4xx响应状态码指标
 * @param input
 */
export function status4xxCountMetrics(input: RouteCountMetricsInput): Promise<CountMetricsOutput> {
  return PostJson(`/api/route-monitor-metrics/count/status-4xx`, {
    body: input,
    resultSchema: CountMetricsSchema
  })
}

/**
 * 5xx响应状态码指标
 * @param input
 */
export function status5xxCountMetrics(input: RouteCountMetricsInput): Promise<CountMetricsOutput> {
  return PostJson(`/api/route-monitor-metrics/count/status-5xx`, {
    body: input,
    resultSchema: CountMetricsSchema
  })
}

/**
 * qps 折线图指标
 * @param input
 */
export function qpsLineMetrics(input: RouteLineMetricsInput): Promise<QpsLineMetricsRecordOutput> {
  return PostJson(`/api/route-monitor-metrics/line/qps`, {
    body: input,
    resultSchema: QpsLineMetricsRecordSchema
  })
}

/**
 * duration 折线图指标
 * @param input
 */
export function durationLineMetrics(input: RouteLineMetricsInput): Promise<DurationLineMetricsRecordOutput> {
  return PostJson(`/api/route-monitor-metrics/line/duration`, {
    body: input,
    resultSchema: DurationLineMetricsRecordSchema
  })
}

/**
 * top qps 折线图指标
 * @param input
 */
export function topQpsLineMetrics(input: TopRouteLineMetricsInput): Promise<TopQpsLineMetricsRecordOutput> {
  return PostJson(`/api/route-monitor-metrics/line/top-qps`, {
    body: input,
    resultSchema: TopQpsLineMetricsRecordSchema
  })
}
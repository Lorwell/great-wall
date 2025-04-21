import {MetricsDateRange} from "@/pages/monitor-metrics/metrics-date-range-picker.tsx";
import {
  CountMetricsValues,
  DurationLineMetricsRecordValues,
  QpsLineMetricsRecordValues,
  TrafficLineMetricsRecordValues
} from "@/constant/api/monitor-metrics/route-metrics/schema.ts";
import {LineMetricsInput} from "@/constant/api/monitor-metrics/types.ts";

export interface RouteCountMetricsInput extends MetricsDateRange {
  appRouteId: number | undefined | null
}

export interface RouteLineMetricsInput extends LineMetricsInput {
  appRouteId: number | undefined | null
}

export type CountMetricsOutput = CountMetricsValues
export type QpsLineMetricsRecordOutput = QpsLineMetricsRecordValues
export type DurationLineMetricsRecordOutput = DurationLineMetricsRecordValues
export type TrafficLineMetricsRecordOutput = TrafficLineMetricsRecordValues
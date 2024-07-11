import {MetricsDateRange} from "@/pages/monitor-metrics/metrics-date-range-picker.tsx";
import {
  CountMetricsValues,
  DurationLineMetricsRecordValues,
  QpsLineMetricsRecordValues,
  TopQpsLineMetricsRecordValues
} from "@/constant/api/monitor-metrics/route-metrics/schema.ts";

export interface RouteCountMetricsInput extends MetricsDateRange {

}

export interface RouteLineMetricsInput extends IntervalMetrics, MetricsDateRange {
}

export interface TopRouteLineMetricsInput extends IntervalMetrics, MetricsDateRange {

  top: number
}


export interface IntervalMetrics {
  interval: number
  intervalType: IntervalType
}

export enum IntervalType {
  SECONDS = "SECONDS",
  MINUTES = "MINUTES",
  HOURS = "HOURS",
  DAYS = "DAYS"
}

export type CountMetricsOutput = CountMetricsValues
export type QpsLineMetricsRecordOutput = QpsLineMetricsRecordValues
export type DurationLineMetricsRecordOutput = DurationLineMetricsRecordValues
export type TopQpsLineMetricsRecordOutput = TopQpsLineMetricsRecordValues
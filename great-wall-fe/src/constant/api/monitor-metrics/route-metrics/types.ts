import {MetricsDateRange} from "@/pages/monitor-metrics/metrics-date-range-picker.tsx";
import {CountMetricsValues, LineMetricsRecordValues} from "@/constant/api/monitor-metrics/route-metrics/schema.ts";

export interface RouteCountMetricsInput extends MetricsDateRange {

}

export interface RouteLineMetricsInput extends MetricsDateRange {
  interval: number
  intervalType: IntervalType
}

export enum IntervalType{
  SECONDS ="SECONDS",
  MINUTES ="MINUTES",
  HOURS ="HOURS",
  DAYS = "DAYS"
}

export type CountMetricsOutput = CountMetricsValues
export type LineMetricsRecordOutput = LineMetricsRecordValues
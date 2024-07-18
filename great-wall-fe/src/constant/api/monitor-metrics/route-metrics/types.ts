import {MetricsDateRange} from "@/pages/monitor-metrics/metrics-date-range-picker.tsx";
import {
  CountMetricsValues,
  DurationLineMetricsRecordValues,
  QpsLineMetricsRecordValues,
  TopQpsLineMetricsRecordValues
} from "@/constant/api/monitor-metrics/route-metrics/schema.ts";
import {IntervalMetrics, LineMetricsInput} from "@/constant/api/monitor-metrics/types.ts";

export interface RouteCountMetricsInput extends MetricsDateRange {

}

export type RouteLineMetricsInput = LineMetricsInput

export interface TopRouteLineMetricsInput extends IntervalMetrics, MetricsDateRange {

  top: number
}

export type CountMetricsOutput = CountMetricsValues
export type QpsLineMetricsRecordOutput = QpsLineMetricsRecordValues
export type DurationLineMetricsRecordOutput = DurationLineMetricsRecordValues
export type TopQpsLineMetricsRecordOutput = TopQpsLineMetricsRecordValues
import {MetricsDateRange} from "@/pages/monitor-metrics/metrics-date-range-picker.tsx";

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

export interface LineMetricsInput extends IntervalMetrics, MetricsDateRange {
}


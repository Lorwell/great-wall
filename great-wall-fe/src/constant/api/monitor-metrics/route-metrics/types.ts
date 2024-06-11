import {MetricsDateRange} from "@/pages/monitor-metrics/metrics-date-range-picker.tsx";
import {CountMetricsValues, LineMetricsRecordValues} from "@/constant/api/monitor-metrics/route-metrics/schema.ts";

export interface RouteMonitorMetricsInput extends MetricsDateRange {

}

export type CountMetricsOutput = CountMetricsValues
export type LineMetricsRecordOutput = LineMetricsRecordValues
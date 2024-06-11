import {LastDateEnum, MetricsDateRange} from "@/pages/monitor-metrics/metrics-date-range-picker.tsx";
import {createContext, useContext} from "react";

export interface MonitorMetricsContext {

  /**
   * 时间范围
   */
  dateRange: MetricsDateRange

}

export const monitorMetricsContext = createContext<MonitorMetricsContext>({
  dateRange: {
    type: "LastDateEnum",
    lastDataEnum: LastDateEnum.Last30Minute
  }
});

/**
 * 监控指标上下文
 */
export function useMonitorMetricsContext(): MonitorMetricsContext {
  return useContext(monitorMetricsContext)
}
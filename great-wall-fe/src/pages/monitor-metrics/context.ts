import {LastDateEnum, MetricsDateRange} from "@/pages/monitor-metrics/metrics-date-range-picker.tsx";
import {createContext, useContext, useEffect} from "react";
import {EventEmitter} from "ahooks/lib/useEventEmitter";
import useApiRequest, {ApiRequestOptions} from "@/components/hooks/useApiRequest.ts";
import {Plugin, Service} from "ahooks/lib/useRequest/src/types";


export interface RefreshMetricsParams {
  dateRange: MetricsDateRange
}

export interface MonitorMetricsContext extends RefreshMetricsParams {

  event$?: EventEmitter<RefreshMetricsParams>

}

export const monitorMetricsContext = createContext<MonitorMetricsContext>({
  event$: undefined,
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

type TPrams = [RefreshMetricsParams]

/**
 * 监控指标得 api 请求
 *
 * 监听事件来触发重新请求
 */
export function useApiRequestMetrics<TData>(service: Service<TData, TPrams>,
                                            options?: ApiRequestOptions<TData, TPrams>,
                                            plugins?: Plugin<TData, TPrams>[]) {
  const {event$, ...ctxParams} = useMonitorMetricsContext();
  const {run, ...rest} = useApiRequest(service, {...options, manual: true}, plugins);
  event$?.useSubscription((params) => run(params))

  useEffect(() => {
    run(ctxParams)
  }, []);

  return rest
}
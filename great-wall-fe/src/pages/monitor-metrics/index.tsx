import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import AutoSizablePanel from "@/components/custom-ui/auto-sizable-panel.tsx";
import {
  LastDateEnum,
  MetricsDateRange,
  MetricsDateRangePicker
} from "@/pages/monitor-metrics/metrics-date-range-picker.tsx";
import {monitorMetricsContext, RefreshMetricsParams} from "@/pages/monitor-metrics/context.ts";
import RefreshSelectPicker from "@/pages/monitor-metrics/refresh-select-picker.tsx";
import {useEventEmitter} from "ahooks";

/**
 * 监控指标
 * @constructor
 */
export default function MonitorMetrics() {
  const navigate = useNavigate();
  const [tabState, setTabState] = useState<"route" | "server" | string>("route");

  const event$ = useEventEmitter<RefreshMetricsParams>();

  const [dateRange, setDateRange] = useState<MetricsDateRange>({
    type: "LastDateEnum",
    lastDataEnum: LastDateEnum.Last30Minute
  });

  useEffect(() => {
    navigate(tabState)
  }, [tabState]);

  useEffect(emitEvent, [dateRange])

  /**
   * 发布事件
   */
  function emitEvent() {
    event$.emit({dateRange});
  }

  return (
    <div className="flex flex-col w-full h-full">

      <Tabs defaultValue="route"
            className="space-y-4 flex-auto flex flex-col"
            onValueChange={setTabState}
      >
        <div className={"flex flex-row justify-between"}>
          <TabsList>
            <TabsTrigger className={"cursor-pointer"} value="route">路由指标</TabsTrigger>
            <TabsTrigger className={"cursor-pointer"} value="server">服务指标</TabsTrigger>
          </TabsList>

          <div className={"flex flex-row space-x-2"}>
            <MetricsDateRangePicker value={dateRange} onChange={setDateRange}/>
            <RefreshSelectPicker onRefresh={emitEvent}/>
          </div>
        </div>

        <monitorMetricsContext.Provider value={{event$, dateRange}}>
          <AutoSizablePanel className={"flex-auto overflow-hidden"}>
            {
              (size) => (
                <div style={{...size}} className={"overflow-auto"}>
                  <Outlet/>
                </div>
              )
            }
          </AutoSizablePanel>
        </monitorMetricsContext.Provider>
      </Tabs>
    </div>
  )
}
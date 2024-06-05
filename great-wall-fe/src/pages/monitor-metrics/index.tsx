import {CalendarDateRangePicker} from "@/pages/monitor-metrics/date-range-picker.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import {Outlet, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import AutoSizablePanel from "@/components/custom-ui/auto-sizable-panel.tsx";

/**
 * 监控指标
 * @constructor
 */
export default function MonitorMetrics() {
  const navigate = useNavigate();
  const [tabState, setTabState] = useState<"route" | "server" | string>("route");

  useEffect(() => {
    navigate(tabState)
  }, [tabState]);

  return (
    <div className="flex flex-col space-y-4 w-full h-full">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-2xl font-bold tracking-tight">监控指标</h2>
        <div className="flex items-center space-x-2">
          <CalendarDateRangePicker/>
        </div>
      </div>

      <Tabs defaultValue="route"
            className="space-y-4 flex-auto flex flex-col"
            onValueChange={setTabState}
      >
        <div>
          <TabsList>
            <TabsTrigger value="route">路由指标</TabsTrigger>
            <TabsTrigger value="server">服务指标</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value={tabState} className={"flex-auto"}>
          <AutoSizablePanel className={"overflow-hidden"}>
            {
              (size) => (
                <div style={{...size}} className={"overflow-auto"}>
                  <Outlet/>
                </div>
              )
            }
          </AutoSizablePanel>
        </TabsContent>
      </Tabs>
    </div>
  )
}
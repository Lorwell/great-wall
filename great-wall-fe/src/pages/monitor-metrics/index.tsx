import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
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
    <div className="flex flex-col w-full h-full">

      <Tabs defaultValue="route"
            className="space-y-4 flex-auto flex flex-col"
            onValueChange={setTabState}
      >
        <div>
          <TabsList>
            <TabsTrigger className={"cursor-pointer"} value="route">路由指标</TabsTrigger>
            <TabsTrigger className={"cursor-pointer"} value="server">服务指标</TabsTrigger>
          </TabsList>
        </div>

        <AutoSizablePanel className={"flex-auto overflow-hidden"}>
          {
            (size) => (
              <div style={{...size}} className={"overflow-auto"}>
                <Outlet/>
              </div>
            )
          }
        </AutoSizablePanel>
      </Tabs>
    </div>
  )
}
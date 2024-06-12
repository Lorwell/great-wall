import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import Charts from "@/components/custom-ui/charts.tsx";
import {useMonitorMetricsContext} from "@/pages/monitor-metrics/context.ts";
import useApiRequest from "@/components/hooks/useApiRequest.ts";
import {qpsLineMetrics} from "@/constant/api/monitor-metrics/route-metrics";
import {lineChartOptions, maxPoint} from "@/pages/monitor-metrics/utils.ts";
import {Timer} from "lucide-react";
import AutoSizablePanel, {Size} from "@/components/custom-ui/auto-sizable-panel.tsx";

/**
 * qps 折线图
 * @constructor
 */
function QpsLineChart({size}: { size: Size }) {
  const {dateRange} = useMonitorMetricsContext();

  const {data, loading} = useApiRequest(
    () => qpsLineMetrics({...dateRange, ...maxPoint(size.width, dateRange)}),
    {refreshDeps: [dateRange, size]});

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          QPS
        </CardTitle>
        {loading ? (<Spinner className={"w-4 h-4"}/>) : (<Timer className={"w-4 h-4"}/>)}
      </CardHeader>
      <CardContent>
        <Charts style={{height: 200}} option={lineChartOptions(data)}/>
      </CardContent>
    </Card>
  )
}

export default function () {
  return (
    <AutoSizablePanel>
      {
        (size) => (
          <QpsLineChart size={size}/>
        )
      }
    </AutoSizablePanel>
  )
}
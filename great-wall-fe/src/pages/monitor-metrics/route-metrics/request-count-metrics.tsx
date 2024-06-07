import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Users} from "lucide-react";
import {useMonitorMetricsContext} from "@/pages/monitor-metrics/context.ts";
import useApiRequest from "@/components/hooks/useApiRequest.ts";
import {Spinner} from "@/components/custom-ui/spinner.tsx";

/**
 * 请求统计指标
 * @constructor
 */
export default function RequestCountMetrics() {
  const {dateRange} = useMonitorMetricsContext();

  const {data, loading} = useApiRequest(() => ({}), {
    refreshDeps: [dateRange]
  });

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          总请求数
        </CardTitle>
        {loading ? (<Spinner className={"w-4 h-4"}/>) : (<Users className={"w-4 h-4"}/>)}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">45,231.89</div>
        <p className="text-xs text-muted-foreground">
          请求数累计
        </p>
      </CardContent>
    </Card>
  )
}

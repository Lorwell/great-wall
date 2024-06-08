import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {ShieldAlert} from "lucide-react";
import {useMonitorMetricsContext} from "@/pages/monitor-metrics/context.ts";
import useApiRequest from "@/components/hooks/useApiRequest.ts";
import {status4xxCountMetrics} from "@/constant/api/monitor-metrics/route-metrics";
import {Spinner} from "@/components/custom-ui/spinner.tsx";

/**
 * 4xx 错误响应统计指标
 * @constructor
 */
export default function Response4xxErrorCountMetrics() {
  const {dateRange} = useMonitorMetricsContext();

  const {data, loading} = useApiRequest(() => status4xxCountMetrics(dateRange),
    {refreshDeps: [dateRange]});

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          4xx 错误数量
        </CardTitle>
        {loading ? (<Spinner className={"w-4 h-4"}/>) : (<ShieldAlert className={"w-4 h-4"}/>)}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data?.value || 0}</div>
        <p className="text-xs text-muted-foreground">
          400 &lt;= 状态码 &lt; 500
        </p>
      </CardContent>
    </Card>
  )
}
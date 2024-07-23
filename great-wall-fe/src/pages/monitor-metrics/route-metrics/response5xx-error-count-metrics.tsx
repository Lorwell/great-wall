import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {ShieldAlert} from "lucide-react";
import {useApiRequestMetrics} from "@/pages/monitor-metrics/context.ts";
import {status5xxCountMetrics} from "@/constant/api/monitor-metrics/route-metrics";
import {Spinner} from "@/components/custom-ui/spinner.tsx";

/**
 * 5xx 错误响应统计指标
 * @constructor
 */
export default function Response5xxErrorCountMetrics() {
  const {data, loading} = useApiRequestMetrics(({dateRange, appRouteId}) =>
    status5xxCountMetrics({...dateRange, appRouteId}));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          5xx 错误数量
        </CardTitle>
        {loading ? (<Spinner className={"w-4 h-4"}/>) : (<ShieldAlert className={"w-4 h-4"}/>)}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data?.value || 0}</div>
        <p className="text-xs text-muted-foreground">
          500 &lt;= 状态码
        </p>
      </CardContent>
    </Card>
  )
}
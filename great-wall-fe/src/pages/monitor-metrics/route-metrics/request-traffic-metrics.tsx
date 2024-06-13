import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Clock11} from "lucide-react";
import {useApiRequestMetrics} from "@/pages/monitor-metrics/context.ts";
import {requestTrafficSumMetrics} from "@/constant/api/monitor-metrics/route-metrics";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import {byteSizeToUnitStr} from "@/utils/Utils.ts";

/**
 * 请求流量指标
 * @constructor
 */
export default function RequestTrafficMetrics() {
  const {data, loading} = useApiRequestMetrics(({dateRange}) => requestTrafficSumMetrics(dateRange));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          请求流量
        </CardTitle>
        {loading ? (<Spinner className={"w-4 h-4"}/>) : (<Clock11 className={"w-4 h-4"}/>)}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{byteSizeToUnitStr(data?.value || 0)}</div>
        <p className="text-xs text-muted-foreground">
          请求流量累加之和
        </p>
      </CardContent>
    </Card>
  )
}
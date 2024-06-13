import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Timer} from "lucide-react";
import {useApiRequestMetrics} from "@/pages/monitor-metrics/context.ts";
import {ipCountMetrics} from "@/constant/api/monitor-metrics/route-metrics";
import {Spinner} from "@/components/custom-ui/spinner.tsx";

/**
 * 访问ip统计指标
 * @constructor
 */
export default function AccessIpCountMetrics() {
  const {data, loading} = useApiRequestMetrics(({dateRange}) => ipCountMetrics(dateRange));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          IP 总数
        </CardTitle>
        {loading ? (<Spinner className={"w-4 h-4"}/>) : (<Timer className={"w-4 h-4"}/>)}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data?.value || 0}</div>
        <p className="text-xs text-muted-foreground">
          访问的 ip 累计
        </p>
      </CardContent>
    </Card>
  )
}
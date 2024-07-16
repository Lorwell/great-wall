import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Users} from "lucide-react";
import {useApiRequestMetrics} from "@/pages/monitor-metrics/context.ts";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import {processCpuMetrics} from "@/constant/api/monitor-metrics/system-metrics";

/**
 * 进程cpu指标
 * @constructor
 */
export default function ProcessCpuMetrics() {
  const {data, loading} = useApiRequestMetrics(() => processCpuMetrics());

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          cpu使用率
        </CardTitle>
        {loading ? (<Spinner className={"w-4 h-4"}/>) : (<Users className={"w-4 h-4"}/>)}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data?.processCpuLoad || "-"}</div>
        <p className="text-xs text-muted-foreground">
          当前cpu使用率
        </p>
      </CardContent>
    </Card>
  )
}

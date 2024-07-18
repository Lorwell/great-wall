import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Users} from "lucide-react";
import {useApiRequestMetrics} from "@/pages/monitor-metrics/context.ts";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import {upTimeMetrics} from "@/constant/api/monitor-metrics/system-metrics";

/**
 * 系统运行时间指标
 * @constructor
 */
export default function UpTimeMetrics() {
  const {data, loading} = useApiRequestMetrics(() => upTimeMetrics());

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          运行时间
        </CardTitle>
        {loading ? (<Spinner className={"w-4 h-4"}/>) : (<Users className={"w-4 h-4"}/>)}
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{data?.upTime || "-"}</div>
        <p className="text-xs text-muted-foreground">
          系统启动时间至今
        </p>
      </CardContent>
    </Card>
  )
}

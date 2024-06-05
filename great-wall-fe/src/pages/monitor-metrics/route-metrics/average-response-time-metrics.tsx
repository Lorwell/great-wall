import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Timer} from "lucide-react";

/**
 * 平均响应时间指标
 * @constructor
 */
export default function AverageResponseTimeMetrics() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          平均响应时间
        </CardTitle>
        <Timer className={"w-4 h-4"}/>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">120ms</div>
        <p className="text-xs text-muted-foreground">
          选中时间内（总响应时间 / 总请求数）
        </p>
      </CardContent>
    </Card>
  )
}
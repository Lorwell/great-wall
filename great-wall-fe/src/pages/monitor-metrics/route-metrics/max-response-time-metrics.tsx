import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Clock11} from "lucide-react";

/**
 * 最大响应时间指标
 * @constructor
 */
export default function MaxResponseTimeMetrics() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          最大响应时间
        </CardTitle>
        <Clock11 className={"w-4 h-4"}/>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">120ms</div>
        <p className="text-xs text-muted-foreground">
          选中时间内响应时间最大的时间
        </p>
      </CardContent>
    </Card>
  )
}
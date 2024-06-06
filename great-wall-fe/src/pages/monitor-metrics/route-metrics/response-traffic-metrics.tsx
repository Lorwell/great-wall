import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Clock11} from "lucide-react";

/**
 * 响应流量指标
 * @constructor
 */
export default function ResponseTrafficMetrics() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          响应流量
        </CardTitle>
        <Clock11 className={"w-4 h-4"}/>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">120M</div>
        <p className="text-xs text-muted-foreground">
          响应流量累加之和
        </p>
      </CardContent>
    </Card>
  )
}
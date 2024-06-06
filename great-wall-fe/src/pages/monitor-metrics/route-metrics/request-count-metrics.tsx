import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Users} from "lucide-react";

/**
 * 请求统计指标
 * @constructor
 */
export default function RequestCountMetrics() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          总请求数
        </CardTitle>
        <Users className={"w-4 h-4"}/>
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

import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {ShieldAlert} from "lucide-react";

/**
 * 4xx 错误响应统计指标
 * @constructor
 */
export default function Response4xxErrorCountMetrics() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          4xx 错误数量
        </CardTitle>
        <ShieldAlert className={"w-4 h-4"}/>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">120</div>
        <p className="text-xs text-muted-foreground">
          选中时间内响应状态码大于等于 400 小于 500
        </p>
      </CardContent>
    </Card>
  )
}
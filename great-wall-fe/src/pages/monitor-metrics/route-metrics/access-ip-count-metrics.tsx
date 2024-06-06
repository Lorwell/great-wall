import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Timer} from "lucide-react";

/**
 * 访问ip统计指标
 * @constructor
 */
export default function AccessIpCountMetrics() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          IP 总数
        </CardTitle>
        <Timer className={"w-4 h-4"}/>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">53</div>
        <p className="text-xs text-muted-foreground">
          选中时间内访问的 ip 累计
        </p>
      </CardContent>
    </Card>
  )
}
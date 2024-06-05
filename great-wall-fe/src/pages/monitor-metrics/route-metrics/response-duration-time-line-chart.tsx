import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Spinner} from "@/components/custom-ui/spinner.tsx";

/**
 * 响应持续时间折线图
 * @constructor
 */
export default function ResponseDurationTimeLineChart() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Duration
        </CardTitle>
        <Spinner className={"w-4 h-4"}/>
      </CardHeader>
      <CardContent>

      </CardContent>
    </Card>
  )
}
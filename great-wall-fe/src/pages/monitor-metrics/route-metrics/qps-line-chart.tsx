import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Spinner} from "@/components/custom-ui/spinner.tsx";

/**
 * qps 折线图
 * @constructor
 */
export default function QpsLineChart() {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          QPS
        </CardTitle>
        <Spinner className={"w-4 h-4"}/>
      </CardHeader>
      <CardContent>

      </CardContent>
    </Card>
  )
}
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import {useApiRequestMetrics} from "@/pages/monitor-metrics/context.ts";
import {qpsLineMetrics} from "@/constant/api/monitor-metrics/route-metrics";
import {maxPoint} from "@/pages/monitor-metrics/utils.ts";
import {Activity} from "lucide-react";
import AutoSizablePanel, {Size} from "@/components/custom-ui/auto-sizable-panel.tsx";
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"

const chartConfig = {
  views: {
    label: "qps",
  },
  value: {
    label: "qps",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

/**
 * qps 折线图
 * @constructor
 */
function QpsLineChart({size}: { size: Size }) {

  const {data, loading} = useApiRequestMetrics(({dateRange}) => qpsLineMetrics(
    {
      ...dateRange,
      ...maxPoint(size.width - 70, dateRange)
    }));

  const chartData = data?.records || []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          QPS
        </CardTitle>
        {loading ? (<Spinner className={"w-4 h-4"}/>) : (<Activity className={"w-4 h-4"}/>)}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} style={{height: "200px", width: "100%"}}>
          <LineChart accessibilityLayer
                     data={chartData}
                     margin={{left: 0, right: 0, top: 0}}
          >
            <CartesianGrid vertical={false}/>

            <XAxis dataKey="unit"
                   tickLine={false}
                   axisLine={false}
                   tickMargin={8}
                   minTickGap={32}
            />

            <YAxis/>

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  nameKey="views"
                />
              }
            />

            <Line
              dataKey="value"
              type="monotone"
              strokeWidth={2}
              dot={false}
            />
          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}

export default function () {
  return (
    <AutoSizablePanel>
      {
        (size) => (
          <QpsLineChart size={size}/>
        )
      }
    </AutoSizablePanel>
  )
}
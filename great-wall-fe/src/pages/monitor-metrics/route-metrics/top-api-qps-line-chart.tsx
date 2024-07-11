import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import AutoSizablePanel, {Size} from "@/components/custom-ui/auto-sizable-panel.tsx";
import {useApiRequestMetrics} from "@/pages/monitor-metrics/context.ts";
import {topQpsLineMetrics} from "@/constant/api/monitor-metrics/route-metrics";
import {maxPoint} from "@/pages/monitor-metrics/utils.ts";
import {GitCommitHorizontal} from "lucide-react";
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent} from "@/components/ui/chart.tsx";
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts";

/**
 * 请求量前 n 的api qps 折线图
 * @constructor
 */
function TopApiQpsLineChartCard({size}: { size: Size, }) {

  const {data, loading} = useApiRequestMetrics(({dateRange}) => topQpsLineMetrics(
    {
      ...dateRange,
      ...maxPoint(size.width - 70, dateRange),
      top: 10
    }));

  const chartData = data?.data || []
  const mapping = data?.mapping || [];

  const chartConfig: ChartConfig = {}

  mapping.forEach((item, i) => {
    chartConfig[item.key] = {
      label: item.label,
      color: `hsl(var(--chart-${i + 1}))`,
    }
  })

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Top Api QPS
        </CardTitle>
        {loading ? (<Spinner className={"w-4 h-4"}/>) : (<GitCommitHorizontal className={"w-4 h-4"}/>)}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} style={{height: "320px", width: "100%"}}>
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
                  className="w-[350px]"
                />
              }
            />

            {
              mapping?.map((item) => {
                return (
                  <Line key={item.key}
                        dataKey={item.key}
                        type="monotone"
                        stroke={`var(--color-${item.key})`}
                        strokeWidth={2}
                        dot={false}
                  />
                )
              })
            }

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
          <TopApiQpsLineChartCard size={size}/>
        )
      }
    </AutoSizablePanel>
  )
}
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import AutoSizablePanel, {Size} from "@/components/custom-ui/auto-sizable-panel.tsx";
import {useApiRequestMetrics} from "@/pages/monitor-metrics/context.ts";
import {durationLineMetrics} from "@/constant/api/monitor-metrics/route-metrics";
import {maxPoint} from "@/pages/monitor-metrics/utils.ts";
import {AudioWaveform} from "lucide-react";
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"

/**
 * 响应持续时间折线图
 * @constructor
 */
function ResponseDurationTimeLineChart({size}: { size: Size }) {

  const {data, loading} = useApiRequestMetrics(({dateRange}) => durationLineMetrics(
    {
      ...dateRange,
      ...maxPoint(size.width - 70, dateRange)
    }));

  const chartData = data?.records || []

  const chartConfig = {
    avgValue: {
      label: "平均值",
      color: "hsl(var(--chart-1))",
    },
    maxValue: {
      label: "最大值",
      color: "hsl(var(--chart-2))",
    },
  } satisfies ChartConfig


  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Duration
        </CardTitle>
        {loading ? (<Spinner className={"w-4 h-4"}/>) : (<AudioWaveform className={"w-4 h-4"}/>)}
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

            <YAxis dataKey="maxValue" tickFormatter={value => `${value}/ms`}/>

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                />
              }
            />

            <Line
              dataKey="avgValue"
              type="monotone"
              stroke="var(--color-avgValue)"
              strokeWidth={2}
              dot={false}
            />

            <Line
              dataKey="maxValue"
              type="monotone"
              stroke="var(--color-maxValue)"
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
          <ResponseDurationTimeLineChart size={size}/>
        )
      }
    </AutoSizablePanel>
  )
}
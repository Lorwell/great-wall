import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import AutoSizablePanel, {Size} from "@/components/custom-ui/auto-sizable-panel.tsx";
import {useApiRequestMetrics} from "@/pages/monitor-metrics/context.ts";
import {maxPoint} from "@/pages/monitor-metrics/utils.ts";
import {AudioWaveform} from "lucide-react";
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts"
import {
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import {threadLineMetrics} from "@/constant/api/monitor-metrics/system-metrics";

const chartConfig = {
  new: {
    label: "NEW",
    color: "hsl(var(--chart-1))",
  },
  runnable: {
    label: "RUNNABLE",
    color: "hsl(var(--chart-2))",
  },
  blocked: {
    label: "BLOCKED",
    color: "hsl(var(--chart-3))",
  },
  waiting: {
    label: "WAITING",
    color: "hsl(var(--chart-4))",
  },
  timedWaiting: {
    label: "TIMED_WAITING",
    color: "hsl(var(--chart-5))",
  },
  terminated: {
    label: "TERMINATED",
    color: "hsl(var(--chart-6))",
  },

} satisfies ChartConfig;


/**
 * 线程折线图
 * @constructor
 */
function ThreadLineChart({size}: { size: Size, }) {

  const {data, loading} = useApiRequestMetrics(({dateRange}) => threadLineMetrics(
    {
      ...dateRange,
      ...maxPoint(size.width - 70, dateRange)
    }));

  const chartData = data?.records || []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          线程
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
            />

            <YAxis/>

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[180px]"
                />
              }
            />

            <ChartLegend content={<ChartLegendContent/>}/>

            <Line
              dataKey={"new"}
              type="monotone"
              stroke={`var(--color-new)`}
              strokeWidth={2}
              dot={false}
            />

            <Line
              dataKey={"runnable"}
              type="monotone"
              stroke={`var(--color-runnable)`}
              strokeWidth={2}
              dot={false}
            />

            <Line
              dataKey={"blocked"}
              type="monotone"
              stroke={`var(--color-blocked)`}
              strokeWidth={2}
              dot={false}
            />

            <Line
              dataKey={"waiting"}
              type="monotone"
              stroke={`var(--color-waiting)`}
              strokeWidth={2}
              dot={false}
            />

            <Line
              dataKey={"timedWaiting"}
              type="monotone"
              stroke={`var(--color-timedWaiting)`}
              strokeWidth={2}
              dot={false}
            />

            <Line
              dataKey={"terminated"}
              type="monotone"
              stroke={`var(--color-terminated)`}
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
          <ThreadLineChart size={size}/>
        )
      }
    </AutoSizablePanel>
  )
}
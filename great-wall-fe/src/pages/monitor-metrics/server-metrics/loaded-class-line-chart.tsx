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
import {loadedClassLineMetrics} from "@/constant/api/monitor-metrics/system-metrics";

const chartConfig = {
  total: {
    label: "总加载类",
    color: "hsl(var(--chart-1))",
  },
  count: {
    label: "加载的类",
    color: "hsl(var(--chart-2))",
  },
  unloaded: {
    label: "卸载的类",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;


/**
 * 类加载折线图
 * @constructor
 */
function LoadedClassLineChart({size}: { size: Size, }) {

  const {data, loading} = useApiRequestMetrics(({dateRange}) => loadedClassLineMetrics(
    {
      ...dateRange,
      ...maxPoint(size.width - 70, dateRange)
    }));

  const chartData = data?.records || []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          类加载
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
                  className="w-[150px]"
                />
              }
            />

            <ChartLegend content={<ChartLegendContent/>}/>

            <Line
              dataKey={"total"}
              type="monotone"
              stroke={`var(--color-total)`}
              strokeWidth={2}
              dot={false}
            />

            <Line
              dataKey={"count"}
              type="monotone"
              stroke={`var(--color-count)`}
              strokeWidth={2}
              dot={false}
            />

            <Line
              dataKey={"unloaded"}
              type="monotone"
              stroke={`var(--color-unloaded)`}
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
          <LoadedClassLineChart size={size}/>
        )
      }
    </AutoSizablePanel>
  )
}
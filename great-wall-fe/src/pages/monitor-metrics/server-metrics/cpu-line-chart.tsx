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
import {percentageFormat} from "@/lib/utils.ts";
import {cpuLineMetrics} from "@/constant/api/monitor-metrics/system-metrics";

const chartConfig = {
  cpuLoad: {
    label: "系统cpu负载",
    color: "hsl(var(--chart-1))",
  },
  processCpuLoad: {
    label: "进程cpu负载",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig;


/**
 * cpu折线图
 * @constructor
 */
function CpuLineChart({size}: { size: Size, }) {

  const {data, loading} = useApiRequestMetrics(({dateRange}) => cpuLineMetrics(
    {
      ...dateRange,
      ...maxPoint(size.width - 70, dateRange)
    }));

  const chartData = data?.records || []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          CPU
        </CardTitle>
        {loading ? (<Spinner className={"w-4 h-4"}/>) : (<AudioWaveform className={"w-4 h-4"}/>)}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} style={{height: "250px", width: "100%"}}>
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

            <YAxis tickFormatter={value => percentageFormat(value, "-")}/>

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  valueFormatter={value => percentageFormat(value, "-")}
                />
              }
            />

            <ChartLegend content={<ChartLegendContent/>}/>

            <Line
              dataKey={"cpuLoad"}
              type="monotone"
              stroke={`var(--color-cpuLoad)`}
              strokeWidth={2}
              dot={false}
            />

            <Line
              dataKey={"processCpuLoad"}
              type="monotone"
              stroke={`var(--color-processCpuLoad)`}
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
          <CpuLineChart size={size}/>
        )
      }
    </AutoSizablePanel>
  )
}
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
import {byteSizeToUnitStr} from "@/utils/Utils.ts";
import {MemoryLineRecordOutput, SystemLineMetricsInput} from "@/constant/api/monitor-metrics/system-metrics/types.ts";
import {ReactNode} from "react";

const chartConfig = {
  use: {
    label: "已使用",
    color: "hsl(var(--chart-1))",
  },
  committed: {
    label: "已提交",
    color: "hsl(var(--chart-2))",
  },
  max: {
    label: "最大值",
    color: "hsl(var(--chart-3))",
  },
} satisfies ChartConfig;

export interface MemoryLineChartProps {
  title: ReactNode
  service: (input: SystemLineMetricsInput) => Promise<MemoryLineRecordOutput>
}


/**
 * 堆内存折线图
 * @constructor
 */
function MemoryLineChart({size, title, service}: MemoryLineChartProps & {
  size: Size,

}) {

  const {data, loading} = useApiRequestMetrics(({dateRange}) => service(
    {
      ...dateRange,
      ...maxPoint(size.width - 70, dateRange)
    }));

  const chartData = data?.records || []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          {title}
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

            <YAxis tickFormatter={value => byteSizeToUnitStr(value, "-1")}/>

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  valueFormatter={value => byteSizeToUnitStr(value, "-1")}
                />
              }
            />

            <ChartLegend content={<ChartLegendContent/>}/>

            <Line
              dataKey={"use"}
              type="monotone"
              stroke={`var(--color-use)`}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey={"committed"}
              type="monotone"
              stroke={`var(--color-committed)`}
              strokeWidth={2}
              dot={false}
            />
            <Line
              dataKey={"max"}
              type="monotone"
              stroke={`var(--color-max)`}
              strokeWidth={2}
              dot={false}
            />

          </LineChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}


export default function (props: MemoryLineChartProps) {
  return (
    <AutoSizablePanel>
      {
        (size) => (
          <MemoryLineChart {...props} size={size}/>
        )
      }
    </AutoSizablePanel>
  )
}
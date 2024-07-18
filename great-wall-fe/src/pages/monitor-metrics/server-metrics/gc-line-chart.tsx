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
import {ReactNode} from "react";
import {GcLineRecordOutput, SystemLineMetricsInput} from "@/constant/api/monitor-metrics/system-metrics/types.ts";

export interface GcLineChartProps {
  title: ReactNode
  service: (input: SystemLineMetricsInput) => Promise<GcLineRecordOutput>
  tickFormatter?: (value: any) => string;
}


/**
 * gc折线图
 * @constructor
 */
function GcLineChart({size, title, service, tickFormatter}: GcLineChartProps & { size: Size }) {

  const {data, loading} = useApiRequestMetrics(({dateRange}) => service(
    {
      ...dateRange,
      ...maxPoint(size.width - 70, dateRange)
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
          {title}
        </CardTitle>
        {loading ? (<Spinner className={"w-4 h-4"}/>) : (<AudioWaveform className={"w-4 h-4"}/>)}
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} style={{height: "280px", width: "100%"}}>
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

            <YAxis tickFormatter={(value, _) => tickFormatter?.(value) || value}/>

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[200px]"
                  valueFormatter={(value) => tickFormatter?.(value) || value}
                />
              }
            />

            <ChartLegend content={<ChartLegendContent/>}/>

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


export default function (props: GcLineChartProps) {
  return (
    <AutoSizablePanel>
      {
        (size) => (
          <GcLineChart {...props} size={size}/>
        )
      }
    </AutoSizablePanel>
  )
}
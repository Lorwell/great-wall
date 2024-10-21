import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import AutoSizablePanel, {Size} from "@/components/custom-ui/auto-sizable-panel.tsx";
import {useApiRequestMetrics} from "@/pages/monitor-metrics/context.ts";
import {trafficMetrics} from "@/constant/api/monitor-metrics/route-metrics";
import {maxPoint} from "@/pages/monitor-metrics/utils.ts";
import {AudioWaveform} from "lucide-react";
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {cn} from "@/utils/shadcnUtils.ts";
import {byteSizeToUnitStr} from "@/utils/Utils.ts";

const chartConfig = {
  request: {
    label: "请求",
    color: "hsl(var(--chart-1))",
  },
  response: {
    label: "响应",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig

type chartKey = keyof typeof chartConfig

/**
 * 响应持续时间折线图
 * @constructor
 */
function TrafficTimeLineChart({size}: { size: Size }) {

  const {data, loading} = useApiRequestMetrics(({dateRange, appRouteId}) => trafficMetrics(
    {
      ...dateRange,
      appRouteId,
      ...maxPoint(size.width - 70, dateRange)
    }));

  const chartData = data?.records || []

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          流量
        </CardTitle>
        {loading ? (<Spinner className={"w-4 h-4"}/>) : (<AudioWaveform className={"w-4 h-4"}/>)}
      </CardHeader>
      <CardContent>
        {/*@ts-ignore*/}
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

            <YAxis tickFormatter={value => byteSizeToUnitStr(value, "0B")}/>

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                  valueFormatter={value => byteSizeToUnitStr(value, "0B")}
                />
              }
            />

            {
              Object.keys(chartConfig).map((key) => {
                const ck = key as chartKey
                return (
                  <Line key={ck}
                        dataKey={ck}
                        type="monotone"
                        stroke={`var(--color-${ck})`}
                        strokeWidth={2}
                        dot={false}
                  />
                )
              })
            }

          </LineChart>
          <div className={"flex flex-row items-center justify-center gap-8"}>

            {Object.keys(chartConfig).map((key) => {
              const ck = key as chartKey
              return (
                <div key={ck}
                     className={cn("flex flex-row items-center gap-2 cursor-pointer")}
                >
                  <div className={"shrink-0 rounded-[2px] border-[--color-border] bg-[--color-bg] h-2.5 w-2.5"}
                       style={{background: `var(--color-${ck})`}}>
                  </div>
                  <span>{chartConfig[ck].label}</span>
                </div>
              )
            })}

          </div>
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
          <TrafficTimeLineChart size={size}/>
        )
      }
    </AutoSizablePanel>
  )
}
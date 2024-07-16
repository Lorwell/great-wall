import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import AutoSizablePanel, {Size} from "@/components/custom-ui/auto-sizable-panel.tsx";
import {useApiRequestMetrics} from "@/pages/monitor-metrics/context.ts";
import {durationLineMetrics} from "@/constant/api/monitor-metrics/route-metrics";
import {maxPoint} from "@/pages/monitor-metrics/utils.ts";
import {AudioWaveform} from "lucide-react";
import {CartesianGrid, Line, LineChart, XAxis, YAxis} from "recharts"
import {ChartConfig, ChartContainer, ChartTooltip, ChartTooltipContent,} from "@/components/ui/chart"
import {useState} from "react";
import {cn} from "@/utils/shadcnUtils.ts";

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

type chartKey = keyof typeof chartConfig

/**
 * 直接内存折线图
 * @constructor
 */
function DirectHeadMemoryLineChart({size}: { size: Size }) {

  const {data, loading} = useApiRequestMetrics(({dateRange}) => durationLineMetrics(
    {
      ...dateRange,
      ...maxPoint(size.width - 70, dateRange)
    }));

  const chartData = data?.records || []

  const [activeChart, setActiveChart] = useState<chartKey>("avgValue")

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          非堆内存
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

            <YAxis tickFormatter={value => `${value}/ms`}/>

            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px]"
                />
              }
            />

            <Line
              dataKey={activeChart}
              type="monotone"
              stroke={`var(--color-${activeChart})`}
              strokeWidth={2}
              dot={false}
            />

          </LineChart>
          <div className={"flex flex-row items-center justify-center gap-8"}>

            {Object.keys(chartConfig).map((key) => {
              const ck = key as chartKey
              return (
                <div key={ck}
                     className={cn("flex flex-row items-center gap-2 cursor-pointer",
                       {
                         "opacity-50": activeChart !== ck
                       }
                     )}
                     onClick={() => setActiveChart(ck)}
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
          <DirectHeadMemoryLineChart size={size}/>
        )
      }
    </AutoSizablePanel>
  )
}
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import Charts from "@/components/custom-ui/charts.tsx";
import {DurationLineMetricsRecordOutput} from "@/constant/api/monitor-metrics/route-metrics/types.ts";
import {EChartsOption} from "echarts-for-react";
import AutoSizablePanel, {Size} from "@/components/custom-ui/auto-sizable-panel.tsx";
import {useApiRequestMetrics} from "@/pages/monitor-metrics/context.ts";
import {durationLineMetrics} from "@/constant/api/monitor-metrics/route-metrics";
import {maxPoint} from "@/pages/monitor-metrics/utils.ts";
import {AudioWaveform} from "lucide-react";


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

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Duration
        </CardTitle>
        {loading ? (<Spinner className={"w-4 h-4"}/>) : (<AudioWaveform className={"w-4 h-4"}/>)}
      </CardHeader>
      <CardContent>
        <Charts style={{height: 200}} option={chartOptions(data)}/>
      </CardContent>
    </Card>
  )
}


function chartOptions(record?: DurationLineMetricsRecordOutput): EChartsOption {
  if (!record || !record.records || record.records.length === 0) {
    return {
      title: {
        text: '暂无数据',
        x: 'center',
        y: 'center',
        textStyle: {
          fontSize: 14,
          fontWeight: 'normal',
        }
      }
    }
  }

  const records = record.records;

  const xData = new Array<string>(records.length);
  const avgData = new Array<any>(records.length);
  const maxData = new Array<any>(records.length);

  records.forEach((record, i) => {
    xData[i] = record.unit
    avgData[i] = record.avgValue / 1000
    maxData[i] = record.maxValue / 1000
  })

  return {
    title: {
      text: ""
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
      },
    },
    grid: {
      top: "10",
      left: '0',
      right: '10',
      bottom: '0',
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xData,
      boundaryGap: ['5%', '5%']
    },
    yAxis: {
      type: 'value',
      boundaryGap: ['0', '20%'],
      axisLabel: {formatter: '{value}s'},
    },
    series: [
      {
        name: "avg",
        type: 'line',
        data: avgData,
      },
      {
        name: "max",
        type: 'line'
        ,
        data: maxData,
      }
    ]
  }
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
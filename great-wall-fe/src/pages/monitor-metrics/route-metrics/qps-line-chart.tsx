import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import Charts from "@/components/custom-ui/charts.tsx";
import {useApiRequestMetrics} from "@/pages/monitor-metrics/context.ts";
import {qpsLineMetrics} from "@/constant/api/monitor-metrics/route-metrics";
import {maxPoint} from "@/pages/monitor-metrics/utils.ts";
import {Activity} from "lucide-react";
import AutoSizablePanel, {Size} from "@/components/custom-ui/auto-sizable-panel.tsx";
import {QpsLineMetricsRecordOutput} from "@/constant/api/monitor-metrics/route-metrics/types";
import {EChartsOption} from "echarts-for-react";

/**
 * qps 折线图
 * @constructor
 */
function QpsLineChart({size}: { size: Size }) {

  const {data, loading} = useApiRequestMetrics(({dateRange}) => qpsLineMetrics(
    {
      ...dateRange,
      ...maxPoint(size.width - 70, dateRange)
    }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          QPS
        </CardTitle>
        {loading ? (<Spinner className={"w-4 h-4"}/>) : (<Activity className={"w-4 h-4"}/>)}
      </CardHeader>
      <CardContent>
        <Charts style={{height: 200}} option={chartOptions(data)}/>
      </CardContent>
    </Card>
  )
}

function chartOptions(record?: QpsLineMetricsRecordOutput): EChartsOption {
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
  const yData = new Array<number>(records.length);

  records.forEach((record, i) => {
    xData[i] = record.unit
    yData[i] = record.value
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
      axisLabel: {formatter: '{value}/s'},
    },
    series: [
      {
        type: 'line',
        data: yData
      }
    ]
  }
}

export default function () {
  return (
    <AutoSizablePanel>
      {
        (size) => (
          <QpsLineChart size={size}/>
        )
      }
    </AutoSizablePanel>
  )
}
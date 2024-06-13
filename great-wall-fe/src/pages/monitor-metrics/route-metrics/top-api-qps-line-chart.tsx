import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import Charts from "@/components/custom-ui/charts.tsx";
import {TopQpsLineMetricsRecordOutput} from "@/constant/api/monitor-metrics/route-metrics/types.ts";
import {EChartsOption} from "echarts-for-react";
import AutoSizablePanel, {Size} from "@/components/custom-ui/auto-sizable-panel.tsx";
import {useApiRequestMetrics} from "@/pages/monitor-metrics/context.ts";
import {topQpsLineMetrics} from "@/constant/api/monitor-metrics/route-metrics";
import {isEmpty} from "lodash";
import {maxPoint} from "@/pages/monitor-metrics/utils.ts";
import {GitCommitHorizontal} from "lucide-react";

/**
 * 请求量前 n 的api qps 折线图
 * @constructor
 */
function TopApiQpsLineChartCard({size}: { size: Size, }) {

  const {data, loading} = useApiRequestMetrics(({dateRange}) => topQpsLineMetrics(
    {
      ...dateRange,
      ...maxPoint(size.width - 70, dateRange),
      top: 20
    }));

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">
          Top Api QPS
        </CardTitle>
        {loading ? (<Spinner className={"w-4 h-4"}/>) : (<GitCommitHorizontal className={"w-4 h-4"}/>)}
      </CardHeader>
      <CardContent>
        <Charts option={chartOptions(data)}/>
      </CardContent>
    </Card>
  )
}

/**
 * 图标配置
 * @param record
 */
function chartOptions(record?: TopQpsLineMetricsRecordOutput): EChartsOption {
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
  // const legendData = records.map(item => item.api)
  const xData = !isEmpty(records) ? records[0].data.map(item => item.unit) : []
  const series = (records || []).map((record) => ({
    type: 'line',
    name: record.api,
    data: record.data.map((item) => item.value)
  }));


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
    // legend: {
    //   data: legendData,
    //   type: 'scroll',
    //   orient: 'vertical',
    //   right: 0,
    //   top: 10,
    //   width: '300px',
    //   selectedMode: 'multiple',
    // },
    grid: {
      top: "20",
      left: '10',
      bottom: '5',
      right: "20",
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
    series: series
  }
}

export default function () {
  return (
    <AutoSizablePanel>
      {
        (size) => (
          <TopApiQpsLineChartCard size={size}/>
        )
      }
    </AutoSizablePanel>
  )
}
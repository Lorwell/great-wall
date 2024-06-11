import {LineMetricsRecordOutput} from "@/constant/api/monitor-metrics/route-metrics/types.ts";
import {EChartsOption} from "echarts-for-react";

/**
 * 折线图 options
 * @param record
 */
export function lineChartOptions(record?: LineMetricsRecordOutput): EChartsOption {
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
        type: 'cross'
      }
    },
    grid: {
      top: "30",
      left: '50',
      right: '10',
      bottom: '30',
    },
    xAxis: {
      type: 'category',
      data: xData
    },
    yAxis: {
      type: 'value',
    },
    series: [
      {
        type: 'line',
        data: yData
      }
    ]
  }
}
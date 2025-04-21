import {IntervalMetrics, IntervalType} from "@/constant/api/monitor-metrics/types";
import {MetricsDateRange} from "@/pages/monitor-metrics/metrics-date-range-picker.tsx";

interface SecondIntervalMetrics extends IntervalMetrics {
  maxPoint: number
}

const partitionInterval: Array<SecondIntervalMetrics> = [
  {
    maxPoint: 15,
    interval: 15,
    intervalType: IntervalType.SECONDS,
  },
  {
    maxPoint: 30,
    interval: 30,
    intervalType: IntervalType.SECONDS,
  },
  {
    maxPoint: 60,
    interval: 1,
    intervalType: IntervalType.MINUTES,
  },
  {
    maxPoint: 120,
    interval: 2,
    intervalType: IntervalType.MINUTES,
  },
  {
    maxPoint: 300,
    interval: 5,
    intervalType: IntervalType.MINUTES,
  },
  {
    maxPoint: 600,
    interval: 10,
    intervalType: IntervalType.MINUTES,
  },
  {
    maxPoint: 1200,
    interval: 20,
    intervalType: IntervalType.MINUTES,
  },
  {
    maxPoint: 1800,
    interval: 30,
    intervalType: IntervalType.MINUTES,
  },
  {
    maxPoint: 3600,
    interval: 1,
    intervalType: IntervalType.HOURS,
  },
  {
    maxPoint: 7200,
    interval: 2,
    intervalType: IntervalType.HOURS,
  },
  {
    maxPoint: 14400,
    interval: 4,
    intervalType: IntervalType.HOURS,
  },
  {
    maxPoint: 21600,
    interval: 6,
    intervalType: IntervalType.HOURS,
  },
  {
    maxPoint: 21600,
    interval: 12,
    intervalType: IntervalType.HOURS,
  },
  {
    maxPoint: 86400,
    interval: 1,
    intervalType: IntervalType.DAYS,
  },
]

/**
 * 计算最大值
 * @param width
 * @param dateRange
 */
export function maxPoint(width: number,
                         dateRange: MetricsDateRange): IntervalMetrics {
  const second = maxSecond(dateRange);
  const point = second / width * 5;

  const maxPoint = partitionInterval.find(num => point < num.maxPoint) || partitionInterval[partitionInterval.length - 1];

  return {interval: maxPoint.interval, intervalType: maxPoint.intervalType};
}

/**
 * 计算差值的最大秒
 * @param dateRange
 */
export function maxSecond(dateRange: MetricsDateRange): number {
  switch (dateRange.type) {
    case "LastDateEnum":
      switch (dateRange.lastDataEnum!) {
        case "Last15Minute":
          return 15 * 60;
        case "Last30Minute":
          return 30 * 60;
        case "Last1Hour":
          return 60 * 60;
        case "Last3Hour":
          return 3 * 60 * 60;
        case "Last6Hour":
          return 6 * 60 * 60;
        case "Last12Hour":
          return 12 * 60 * 60;
        case "Last1Day":
          return 24 * 60 * 60;
        case "Last3Day":
          return 3 * 24 * 60 * 60;
        case "Last7Day":
          return 7 * 24 * 60 * 60;
        case "Last15Day":
          return 15 * 24 * 60 * 60;
      }
      break
    case "DateRange":
      let {from, to} = dateRange.dateRange!;
      return ((to || new Date()).getTime() - from!.getTime()) / 1000
  }
  throw new Error()
}

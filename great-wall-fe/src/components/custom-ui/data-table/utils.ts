import {DateTimeFilterOptions, DateTimeFormatEnum} from "@/components/custom-ui/data-table/types.ts";
import {DateRange} from "react-day-picker";
import {
  getMetricsDateValue,
  MetricsDateRange
} from "@/components/custom-ui/date-time-picker/metrics-date-range-calendar.tsx";
import {
  getMetricsDateTimeValue,
  MetricsDateTimeRange
} from "@/components/custom-ui/date-time-picker/metrics-date-time-range-calendar.tsx";
import dayjs from "dayjs";

export type DateRangeValues = { from: string, to: string }

/**
 * 获取时间范围的具体时间值
 * @param filter
 * @param filterValue
 */
export function getDateRangeValues(
  filter: DateTimeFilterOptions,
  filterValue?: unknown
): DateRangeValues | undefined {
  if (!filterValue) return undefined;

  let format = "YYYY-MM-DD HH:mm:ss"
  let dateRange: DateRange | undefined

  // 年月
  if (filter.format === DateTimeFormatEnum.YEAR_MONTH) {
    format = "YYYY-MM"
    dateRange = filterValue as DateRange
  }
  // 年月日
  else if (filter.format === DateTimeFormatEnum.DATE) {
    format = "YYYY-MM-DD"

    const value = filterValue as MetricsDateRange;
    if (value.type === "MetricsDateEnum") {
      dateRange = {
        from: getMetricsDateValue(value.lastDataEnum!)
      }
    } else {
      dateRange = value.dateRange
    }
  }
  // 时分
  else if (filter.format === DateTimeFormatEnum.HOUR_MINUTE) {
    format = "HH:mm"
    dateRange = filterValue as DateRange
  }
  // 时分秒
  else if (filter.format === DateTimeFormatEnum.TIME) {
    format = "HH:mm:ss"
    dateRange = filterValue as DateRange
  }
  // 带时间的
  else {
    const value = filterValue as MetricsDateTimeRange

    switch (filter.format) {
      case DateTimeFormatEnum.YEAR_MONTH_DAY_HOUR:
        format = "YYYY-MM-DD HH"
        break;
      case DateTimeFormatEnum.YEAR_MONTH_DAY_HOUR_MINUTE:
        format = "YYYY-MM-DD HH:mm"
        break;
      case DateTimeFormatEnum.TIMESTAMP:
        format = "YYYY-MM-DD HH:mm:ss"
        break;
    }

    // TODO
    if (value.type === "MetricsDateTime") {
      dateRange = {
        from: getMetricsDateTimeValue(value.metricsDateTime!)
      }
    } else {
      dateRange = value.dateRange
    }
  }

  if (dateRange) {
    const from = dateRange.from || new Date();
    const to = dateRange.to || new Date();

    return {
      from: dayjs(from <= to ? from : to).format(format),
      to: dayjs(from > to ? from : to).format(format)
    }
  } else {
    return undefined
  }
}

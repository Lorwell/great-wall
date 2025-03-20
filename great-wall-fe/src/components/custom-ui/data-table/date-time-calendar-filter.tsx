import {DateTimeFilterOptions, DateTimeFormatEnum} from "@/components/custom-ui/data-table/types.ts";
import {Column} from "@tanstack/react-table";
import {MonthRangeCalendar} from "@/components/custom-ui/date-time-picker/month-range-calendar.tsx";
import {DateRange} from "react-day-picker";
import {
  MetricsDateRange,
  MetricsDateRangeCalendar
} from "@/components/custom-ui/date-time-picker/metrics-date-range-calendar.tsx";
import {
  MetricsDateTimeRange,
  MetricsDateTimeRangeCalendar
} from "@/components/custom-ui/date-time-picker/metrics-date-time-range-calendar.tsx";
import TimeRangeCalendar from "@/components/custom-ui/date-time-picker/time-range-calendar.tsx";

/**
 * 时间日历
 */
export function DateTimeCalendarFilter(
  {
    filter,
    column,
    onSelected
  }: { filter: DateTimeFilterOptions, column: Column<unknown>, onSelected?: () => void }) {

  const format = filter.format;
  return (
    <>
      {format === DateTimeFormatEnum.YEAR_MONTH && (
        <MonthRangeCalendar
          selectedMonthRange={column.getFilterValue() as DateRange | undefined}
          onMonthRangeSelect={(value) => {
            if (value.from || value.to) {
              column.setFilterValue(value);
            } else {
              column.setFilterValue(undefined);
            }
            onSelected?.();
          }}
        />
      )}
      {format === DateTimeFormatEnum.DATE && (
        <MetricsDateRangeCalendar
          value={column.getFilterValue() as MetricsDateRange | undefined}
          onChange={(value) => {
            if (value.lastDataEnum || value.dateRange?.from || value.dateRange?.to) {
              column.setFilterValue(value);
            } else {
              column.setFilterValue(undefined);
            }
            onSelected?.();
          }}
        />
      )}

      {format === DateTimeFormatEnum.YEAR_MONTH_DAY_HOUR && (
        <MetricsDateTimeRangeCalendar
          granularity={"hour"}
          value={column.getFilterValue() as MetricsDateTimeRange | undefined}
          onChange={(value) => {
            if (value.metricsDateTime || value.dateRange?.from || value.dateRange?.to) {
              column.setFilterValue(value);
            } else {
              column.setFilterValue(undefined);
            }
            onSelected?.();
          }}
        />
      )}
      {format === DateTimeFormatEnum.YEAR_MONTH_DAY_HOUR_MINUTE && (
        <MetricsDateTimeRangeCalendar
          granularity={"minute"}
          value={column.getFilterValue() as MetricsDateTimeRange | undefined}
          onChange={(value) => {
            if (value.metricsDateTime || value.dateRange?.from || value.dateRange?.to) {
              column.setFilterValue(value);
            } else {
              column.setFilterValue(undefined);
            }
            onSelected?.();
          }}
        />
      )}
      {format === DateTimeFormatEnum.TIMESTAMP && (
        <MetricsDateTimeRangeCalendar
          value={column.getFilterValue() as MetricsDateTimeRange | undefined}
          onChange={(value) => {
            if (value.metricsDateTime || value.dateRange?.from || value.dateRange?.to) {
              column.setFilterValue(value);
            } else {
              column.setFilterValue(undefined);
            }
            onSelected?.();
          }}
        />
      )}
      {format === DateTimeFormatEnum.HOUR_MINUTE && (
        <TimeRangeCalendar
          granularity={"minute"}
          value={column.getFilterValue() as DateRange | undefined}
          onChange={(value) => {
            if (value) {
              column.setFilterValue(value);
            } else {
              column.setFilterValue(undefined);
            }
            onSelected?.();
          }}
        />
      )}
      {format === DateTimeFormatEnum.TIME && (
        <TimeRangeCalendar
          granularity={"second"}
          value={column.getFilterValue() as DateRange | undefined}
          onChange={(value) => {
            if (value) {
              column.setFilterValue(value);
            } else {
              column.setFilterValue(undefined);
            }
            onSelected?.();
          }}
        />
      )}
    </>
  )
}

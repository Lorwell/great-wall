import {useState} from "react"
import {CalendarIcon} from "@radix-ui/react-icons"
import {addDays, format, subDays, subHours, subMinutes} from "date-fns"
import {DateRange} from "react-day-picker"
import {cn} from "@/lib/utils"
import {Button, ButtonProps} from "@/components/ui/button.tsx";
import {Check} from "lucide-react";
import {DateTimeRangeCalendar} from "./date-time-range-calendar.tsx";
import {useControllableValue} from "ahooks";

export interface MetricsDateTimeRangeCalendarProps {
  className?: string

  value?: MetricsDateTimeRange

  onChange?: (value: MetricsDateTimeRange) => void

  granularity?: 'hour' | 'minute' | 'second',
}

export enum MetricsDateTimeEnum {
  Last30Minute = "Last30Minute",
  Last1Hour = "Last1Hour",
  Last6Hour = "Last6Hour",
  Last12Hour = "Last12Hour",
  Last1Day = "Last1Day",
  Last3Day = "Last3Day",
  Last7Day = "Last7Day",
  Future1Day = "Future1Day",
  Future3Day = "Future3Day",
  Future7Day = "Future7Day",
}

const lastDateTimeLabels: Array<{ value: MetricsDateTimeEnum, label: string }> = [
  {
    value: MetricsDateTimeEnum.Last30Minute,
    label: "近 30 分钟",
  },
  {
    value: MetricsDateTimeEnum.Last1Hour,
    label: "近 1 小时",
  },
  {
    value: MetricsDateTimeEnum.Last6Hour,
    label: "近 6 小时",
  },
  {
    value: MetricsDateTimeEnum.Last12Hour,
    label: "近 12 小时",
  },
  {
    value: MetricsDateTimeEnum.Last1Day,
    label: "近 1 天",
  },
  {
    value: MetricsDateTimeEnum.Last3Day,
    label: "近 3 天",
  },
  {
    value: MetricsDateTimeEnum.Last7Day,
    label: "近 7 天",
  },
  {
    value: MetricsDateTimeEnum.Future1Day,
    label: "未来 1 天",
  },
  {
    value: MetricsDateTimeEnum.Future3Day,
    label: "未来 3 天",
  },
  {
    value: MetricsDateTimeEnum.Future7Day,
    label: "未来 7 天",
  },
]

/**
 * 获取 [MetricsDateTime] 对应的说明
 * @param lastDate
 */
export function getMetricsDateTimeLabel(lastDate: MetricsDateTimeEnum): string | undefined {
  return lastDateTimeLabels.find(it => it.value === lastDate)?.label
}

/**
 * 获取 [MetricsDateTime] 对应的值
 * @param lastDate
 */
export function getMetricsDateTimeValue(lastDate: MetricsDateTimeEnum): Date {
  switch (lastDate) {
    case MetricsDateTimeEnum.Last30Minute:
      return subMinutes(new Date(), 30)
    case MetricsDateTimeEnum.Last1Hour:
      return subHours(new Date(), 1)
    case MetricsDateTimeEnum.Last6Hour:
      return subHours(new Date(), 6)
    case MetricsDateTimeEnum.Last12Hour:
      return subHours(new Date(), 12)
    case MetricsDateTimeEnum.Last1Day:
      return subDays(new Date(), 1)
    case MetricsDateTimeEnum.Last3Day:
      return subDays(new Date(), 3)
    case MetricsDateTimeEnum.Last7Day:
      return subDays(new Date(), 7)
    case MetricsDateTimeEnum.Future1Day:
      return addDays(new Date(), 1)
    case MetricsDateTimeEnum.Future3Day:
      return addDays(new Date(), 3)
    case MetricsDateTimeEnum.Future7Day:
      return addDays(new Date(), 7)
    default:
      return new Date()
  }
}

export interface MetricsDateTimeRange {

  /**
   * 时间类型，指定类型的值不为空
   */
  type: "DateRange" | "MetricsDateTime"

  /**
   * 最近时间枚举
   */
  metricsDateTime?: MetricsDateTimeEnum

  /**
   * 时间范围
   */
  dateRange?: DateRange

}

/**
 * 指标日期范围选择器
 *
 * @constructor
 */
export function MetricsDateTimeRangeCalendar(
  {
    className,
    granularity = "second",
    ...props
  }: MetricsDateTimeRangeCalendarProps) {

  const [data, setDate] = useControllableValue<MetricsDateTimeRange>(props, {
    valuePropName: "value",
    trigger: "onChange",
  });

  const [_date, _setDate] = useState<MetricsDateTimeRange>(() => {
    if (data) return data
    return {
      type: "MetricsDateTime",
      metricsDateTime: MetricsDateTimeEnum.Last30Minute
    }
  })

  function handleSubmit() {
    setDate(_date)
  }

  return (
    <div className={cn("flex flex-col space-y-2 w-auto", className)}>
      <div className={"flex flex-row space-x-4 pt-4"}>
        <div className={"flex flex-col space-y-2 items-end"}>
          <div className={"pr-4"}>
            <Button variant={"outline"} asChild>
              <div className={cn("flex items-center justify-start text-left font-normal",)}>
                <CalendarIcon className="mr-2 h-4 w-4"/>
                <MetricsDateRangeLabel date={_date} granularity={granularity}/>
              </div>
            </Button>
          </div>

          <DateTimeRangeCalendar
            granularity={granularity}
            selected={_date.dateRange}
            onSelect={(dateRange) => _setDate({type: "DateRange", dateRange})}
          />
        </div>
        <div className={"pr-4 flex flex-col"}>
          {lastDateTimeLabels.map(it => (
            <LastDateButton key={it.value}
                            date={_date}
                            dateEnum={it.value}
                            onClick={_setDate}
            >
              {it.label}
            </LastDateButton>
          ))}
        </div>
      </div>
      <div className={"flex flex-row justify-end px-4 pb-2"}>
        <Button onClick={handleSubmit}>
          <span className={"px-2"}>确定</span>
        </Button>
      </div>
    </div>
  )
}

interface LastDateButtonProps extends Omit<ButtonProps, "onClick"> {
  date: MetricsDateTimeRange,
  dateEnum: MetricsDateTimeEnum,
  onClick?: (date: MetricsDateTimeRange) => void
}

function LastDateButton({date, dateEnum, children, onClick}: LastDateButtonProps) {
  const active = date.metricsDateTime === dateEnum;
  return (
    <Button asChild variant={"ghost"} className={"justify-end cursor-pointer"}
            onClick={() => onClick?.({type: "MetricsDateTime", metricsDateTime: dateEnum})}>
      <div>
        <Check className={cn("w-4 h-4 mr-2", !active && "invisible")}/>
        {children}
      </div>
    </Button>
  )
}

export function MetricsDateRangeLabel(
  {
    date,
    granularity
  }: { date: MetricsDateTimeRange, granularity: 'hour' | 'minute' | 'second', }) {
  // 选择时间范围
  if (date.type === "DateRange") {

    let formatStr: string = "yyyy-MM-dd HH:mm:ss"
    if (granularity === "hour") {
      formatStr = "yyyy-MM-dd HH"
    } else if (granularity === "minute") {
      formatStr = "yyyy-MM-dd HH:mm"
    } else if (granularity === "second") {
      formatStr = "yyyy-MM-dd HH:mm:ss"
    }

    const dateRange = date.dateRange;
    return dateRange?.from ? (
      dateRange?.to ? (
        <>
          {format(dateRange.from, formatStr)} -{" "}
          {format(dateRange.to, formatStr)}
        </>
      ) : (
        <>
          {format(dateRange.from, formatStr)} - 至今
        </>
      )
    ) : (
      <span>选择时间</span>
    )
  }

  // 最后的时间常量
  const lastDataEnum = date.metricsDateTime;
  if (lastDataEnum) {
    return getMetricsDateTimeLabel(lastDataEnum)
  }

  return (<span>选择时间</span>)
}

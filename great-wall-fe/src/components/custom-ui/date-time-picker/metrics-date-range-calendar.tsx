import {useState} from "react"
import {CalendarIcon} from "@radix-ui/react-icons"
import {addDays, format, subDays} from "date-fns"
import {DateRange} from "react-day-picker"
import {cn} from "@/lib/utils"
import {Button, ButtonProps} from "@/components/ui/button.tsx";
import {Check} from "lucide-react";
import {useControllableValue} from "ahooks";
import {DateRangeCalendar} from "@/components/custom-ui/date-time-picker/date-range-calendar.tsx";

export interface MetricsDateRangeCalendarProps {
  className?: string

  value?: MetricsDateRange

  onChange?: (value: MetricsDateRange) => void
}

export enum MetricsDateEnum {
  Last15Day = "Last15Day",
  Last30Day = "Last30Day",
  Last60Day = "Last60Day",
  Last90Day = "Last90Day",
  Future15Day = "Future15Day",
  Future30Day = "Future30Day",
  Future60Day = "Future60Day",
  Future90Day = "Future90Day",
}

const lastDateLabels: Array<{ value: MetricsDateEnum, label: string }> = [
  {
    value: MetricsDateEnum.Last15Day,
    label: "过去 15 天",
  },
  {
    value: MetricsDateEnum.Last30Day,
    label: "过去 30 天",
  },
  {
    value: MetricsDateEnum.Last60Day,
    label: "过去 60 天",
  },
  {
    value: MetricsDateEnum.Last90Day,
    label: "过去 90 天",
  },
  {
    value: MetricsDateEnum.Future15Day,
    label: "未来 15 天",
  },
  {
    value: MetricsDateEnum.Future30Day,
    label: "未来 30 天",
  },
  {
    value: MetricsDateEnum.Future60Day,
    label: "未来 60 天",
  },
  {
    value: MetricsDateEnum.Future90Day,
    label: "未来 90 天",
  },

]

/**
 * 获取 [MetricsDateEnum] 对应的说明
 * @param lastDate
 */
export function getMetricsDateLabel(lastDate: MetricsDateEnum): string | undefined {
  return lastDateLabels.find(it => it.value === lastDate)?.label
}

/**
 * 获取 [MetricsDateEnum] 对应的值
 * @param lastDate
 */
export function getMetricsDateValue(lastDate: MetricsDateEnum): Date {
  switch (lastDate) {
    case MetricsDateEnum.Last15Day:
      return subDays(new Date(), 15)
    case MetricsDateEnum.Last30Day:
      return subDays(new Date(), 30)
    case MetricsDateEnum.Last60Day:
      return subDays(new Date(), 60)
    case MetricsDateEnum.Last90Day:
      return subDays(new Date(), 90)
    case MetricsDateEnum.Future15Day:
      return addDays(new Date(), 15)
    case MetricsDateEnum.Future30Day:
      return addDays(new Date(), 30)
    case MetricsDateEnum.Future60Day:
      return addDays(new Date(), 60)
    case MetricsDateEnum.Future90Day:
      return addDays(new Date(), 90)
    default:
      return new Date()
  }
}

export interface MetricsDateRange {

  /**
   * 时间类型，指定类型的值不为空
   */
  type: "DateRange" | "MetricsDateEnum"

  /**
   * 最近时间枚举
   */
  lastDataEnum?: MetricsDateEnum

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
export function MetricsDateRangeCalendar({className, ...props}: MetricsDateRangeCalendarProps) {

  const [data, setDate] = useControllableValue<MetricsDateRange>(props, {
    valuePropName: "value",
    trigger: "onChange",
  });

  const [_date, _setDate] = useState<MetricsDateRange>(() => {
    if (data) return data
    return {
      type: "MetricsDateEnum",
      lastDataEnum: MetricsDateEnum.Last30Day
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
                <MetricsDateRangeLabel date={_date}/>
              </div>
            </Button>
          </div>

          <DateRangeCalendar
            selected={_date.dateRange}
            onSelect={(dateRange) => _setDate({type: "DateRange", dateRange})}
          />
        </div>
        <div className={"pr-4 flex flex-col"}>
          {lastDateLabels.map(it => (
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
  date: MetricsDateRange,
  dateEnum: MetricsDateEnum,
  onClick?: (date: MetricsDateRange) => void
}

function LastDateButton({date, dateEnum, children, onClick}: LastDateButtonProps) {
  const active = date.lastDataEnum === dateEnum;
  return (
    <Button asChild variant={"ghost"} className={"justify-end cursor-pointer"}
            onClick={() => onClick?.({type: "MetricsDateEnum", lastDataEnum: dateEnum})}>
      <div>
        <Check className={cn("w-4 h-4 mr-2", !active && "invisible")}/>
        {children}
      </div>
    </Button>
  )
}

export function MetricsDateRangeLabel({date}: { date: MetricsDateRange }) {
  // 选择时间范围
  if (date.type === "DateRange") {
    const dateRange = date.dateRange;

    return dateRange?.from ? (
      dateRange?.to ? (
        <>
          {format(dateRange.from, "yyyy-MM-dd")} -{" "}
          {format(dateRange.to, "yyyy-MM-dd")}
        </>
      ) : (
        <>
          {format(dateRange.from, "yyyy-MM-dd")} - 至今
        </>
      )
    ) : (
      <span>选择时间</span>
    )
  }

  // 最后的时间常量
  const lastDataEnum = date.lastDataEnum;
  if (lastDataEnum) {
    return getMetricsDateLabel(lastDataEnum)
  }

  return (<span>选择时间</span>)
}

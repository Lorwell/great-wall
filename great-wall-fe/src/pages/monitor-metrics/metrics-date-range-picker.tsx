import {ReactElement, ReactNode, useState} from "react"
import {CalendarIcon} from "@radix-ui/react-icons"
import {format} from "date-fns"
import {DateRange} from "react-day-picker"
import {cn} from "@/utils/shadcnUtils.ts"
import {Button, ButtonProps} from "@/components/ui/button.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Check} from "lucide-react";
import {DateTimeRangePicker} from "@/components/custom-ui/date-time-range-picker.tsx";
import {useControllableValue} from "ahooks";


export interface MetricsDateRangePickerProps {
  className?: string

  value?: MetricsDateRange

  onChange?: (value: MetricsDateRange) => void
}

export enum LastDateEnum {
  Last15Minute = "Last15Minute",
  Last30Minute = "Last30Minute",
  Last1Hour = "Last1Hour",
  Last3Hour = "Last3Hour",
  Last6Hour = "Last6Hour",
  Last12Hour = "Last12Hour",
  Last1Day = "Last1Day",
  Last3Day = "Last3Day",
  Last7Day = "Last7Day",
  Last15Day = "Last15Day",
}

const lastDateRecords: Array<{ value: LastDateEnum, label: ReactNode | ReactElement }> = [
  {
    value: LastDateEnum.Last15Minute,
    label: "近 15 分钟",
  },
  {
    value: LastDateEnum.Last30Minute,
    label: "近 30 分钟",
  },
  {
    value: LastDateEnum.Last1Hour,
    label: "近 1 小时",
  },
  {
    value: LastDateEnum.Last3Hour,
    label: "近 3 小时",
  },
  {
    value: LastDateEnum.Last6Hour,
    label: "近 6 小时",
  },
  {
    value: LastDateEnum.Last12Hour,
    label: "近 12 小时",
  },
  {
    value: LastDateEnum.Last1Day,
    label: "近 1 天",
  },
  {
    value: LastDateEnum.Last3Day,
    label: "近 3 天",
  },
  {
    value: LastDateEnum.Last7Day,
    label: "近 7 天",
  },
  {
    value: LastDateEnum.Last15Day,
    label: "近 15 天",
  },
]

export interface MetricsDateRange {

  /**
   * 时间类型，指定类型的值不为空
   */
  type: "DateRange" | "LastDateEnum"

  /**
   * 最近时间枚举
   */
  lastDataEnum?: LastDateEnum

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
export function MetricsDateRangePicker({className, ...props}: MetricsDateRangePickerProps) {
  const [open, setOpen] = useState<boolean>(false)

  const [date, setDate] = useControllableValue<MetricsDateRange>(props, {
    valuePropName: "value",
    trigger: "onChange",
  });

  const [_date, _setDate] = useState<MetricsDateRange>({
    type: "LastDateEnum",
    lastDataEnum: LastDateEnum.Last30Minute
  })

  function handleSubmit() {
    setDate(_date)
    setOpen(false)
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={"outline"} asChild>
          <div className={cn("flex items-center justify-start text-left font-normal cursor-pointer",)}>
            <CalendarIcon className="mr-2 h-4 w-4"/>
            <MetricsDateRangeLabel date={date || _date}/>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className={cn("flex flex-col space-y-2 w-auto", className)}>

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

            <DateTimeRangePicker
              selected={_date.dateRange}
              onSelect={(dateRange) => _setDate({type: "DateRange", dateRange})}
            />
          </div>
          <div className={"pr-4 flex flex-col"}>
            {lastDateRecords.map(it => (
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
          <Button variant={"outline"} onClick={handleSubmit}>
            <span className={"px-2"}>确定</span>
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  )
}

interface LastDateButtonProps extends Omit<ButtonProps, "onClick"> {
  date: MetricsDateRange,
  dateEnum: LastDateEnum,
  onClick?: (date: MetricsDateRange) => void
}

function LastDateButton({date, dateEnum, children, onClick}: LastDateButtonProps) {
  const active = date.lastDataEnum === dateEnum;
  return (
    <Button asChild variant={"ghost"} className={"justify-end cursor-pointer"}
            onClick={() => onClick?.({type: "LastDateEnum", lastDataEnum: dateEnum})}>
      <div>
        <Check className={cn("w-4 h-4 mr-2", !active && "invisible")}/>
        {children}
      </div>
    </Button>
  )
}

function MetricsDateRangeLabel({date}: { date: MetricsDateRange }) {
  // 选择时间范围
  if (date.type === "DateRange") {
    const dateRange = date.dateRange;

    return dateRange?.from ? (
      dateRange?.to ? (
        <>
          {format(dateRange.from, "yyyy-MM-dd HH:mm:ss")} -{" "}
          {format(dateRange.to, "yyyy-MM-dd HH:mm:ss")}
        </>
      ) : (
        <>
          {format(dateRange.from, "yyyy-MM-dd HH:mm:ss")} - 至今
        </>
      )
    ) : (
      <span>选择时间</span>
    )
  }

  // 最后的时间常量
  const lastDataEnum = date.lastDataEnum;
  if (lastDataEnum) {
    switch (lastDataEnum) {
      case LastDateEnum.Last15Minute:
        return (<span>近15分钟</span>)
      case LastDateEnum.Last30Minute:
        return (<span>近30分钟</span>)
      case LastDateEnum.Last1Hour:
        return (<span>近1小时</span>)
      case LastDateEnum.Last3Hour:
        return (<span>近3小时</span>)
      case LastDateEnum.Last6Hour:
        return (<span>近6小时</span>)
      case LastDateEnum.Last12Hour:
        return (<span>近12小时</span>)
      case LastDateEnum.Last1Day:
        return (<span>近1天</span>)
      case LastDateEnum.Last3Day:
        return (<span>近3天</span>)
      case LastDateEnum.Last7Day:
        return (<span>近7天</span>)
      case LastDateEnum.Last15Day:
        return (<span>近15天</span>)
    }
  }

  return (<span>选择时间</span>)
}
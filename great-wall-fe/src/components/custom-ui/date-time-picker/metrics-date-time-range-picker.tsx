import {useState} from "react"
import {CalendarIcon} from "@radix-ui/react-icons"
import {cn} from "@/lib/utils"
import {Button} from "@/components/ui/button.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {useControllableValue} from "ahooks";
import {
  MetricsDateRangeLabel,
  MetricsDateTimeRange,
  MetricsDateTimeRangeCalendar,
  MetricsDateTimeRangeCalendarProps
} from "./metrics-date-time-range-calendar.tsx";


export type MetricsDateRangePickerProps = MetricsDateTimeRangeCalendarProps & {

  granularity?: 'hour' | 'minute' | 'second',

}

/**
 * 指标日期范围选择器
 *
 * @constructor
 */
export function MetricsDateTimeRangePicker(
  {
    className,
    granularity = "second",
    ...props
  }: MetricsDateRangePickerProps) {
  const [open, setOpen] = useState<boolean>(false)

  const [date, setDate] = useControllableValue<MetricsDateTimeRange>(props, {
    valuePropName: "value",
    trigger: "onChange",
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant={"outline"} asChild>
          <div className={cn("flex items-center justify-start text-left font-normal cursor-pointer",)}>
            <CalendarIcon className="mr-2 h-4 w-4"/>
            <MetricsDateRangeLabel date={date} granularity={granularity}/>
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className={cn("flex flex-col space-y-2 w-auto", className)}>
        <MetricsDateTimeRangeCalendar
          value={date}
          onChange={setDate}
        />
      </PopoverContent>
    </Popover>
  )
}

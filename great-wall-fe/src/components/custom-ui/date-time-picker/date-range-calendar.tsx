import {Calendar, CalendarProps} from "@/components/ui/calendar.tsx";
import {DateRange, SelectRangeEventHandler} from "react-day-picker";

export interface DateRangeCalendarProps extends Omit<CalendarProps, "mode" | "numberOfMonths" | "selected" | "onSelect"> {

  selected?: DateRange;

  onSelect?: SelectRangeEventHandler

}

/**
 * 时间范围日历
 * @param initialFocus
 * @param components
 * @param props
 * @constructor
 */
function DateRangeCalendar({initialFocus, components, ...props}: DateRangeCalendarProps) {
  return (
    <Calendar {...props}
              initialFocus={initialFocus}
              mode="range"
              numberOfMonths={2}
              components={{
                ...components,
              }}
    />
  )
}


export {DateRangeCalendar}

import {Calendar, CalendarProps} from "@/components/ui/calendar.tsx";
import {DateRange, FooterProps, SelectRangeEventHandler, useActiveModifiers, useDayPicker} from "react-day-picker";
import {createContext, useContext, useEffect, useId} from "react";
import {useMap, useMemoizedFn} from "ahooks";
import {TimeCalendar} from "./time-calendar.tsx";
import {format, parse} from "date-fns";
import {TimeValue} from "react-aria";

export interface DateTimeRangeCalendarProps extends Omit<CalendarProps, "mode" | "numberOfMonths" | "selected" | "onSelect"> {

  selected?: DateRange;

  onSelect?: SelectRangeEventHandler

  granularity?: 'hour' | 'minute' | 'second',

}

export interface DateTimeContext {

  granularity: 'hour' | 'minute' | 'second',

  isFrom: (timeId: string) => boolean

  setDay: (timeId: string, day: string) => void

}

const calendarContext = createContext<DateTimeContext | undefined>(undefined);

/**
 * 时间范围日历
 * @constructor
 */
function DateTimeRangeCalendar(
  {
    initialFocus,
    components,
    granularity = "second",
    ...props
  }: DateTimeRangeCalendarProps) {
  const [displayMonthMap, displayMonthMapOptions] = useMap<string, string>();

  const setDay = useMemoizedFn((timeId: string, displayMonth: string) => {
    displayMonthMapOptions.set(timeId, displayMonth)
  })

  const isFrom = useMemoizedFn((timeId: string) => {
    const currentDateDay = displayMonthMap.get(timeId);
    if (!currentDateDay) return true

    const otherDateDay = Array.from(displayMonthMap.entries())
      .filter(([key]) => key !== timeId)
      .map(([_, value]) => value)
      .find((value) => !!value);
    if (!otherDateDay) return true

    const currentDate = parse(currentDateDay, "yyyy-MM-dd", new Date())
    const otherDate = parse(otherDateDay, "yyyy-MM-dd", new Date())
    return currentDate.getTime() < otherDate.getTime();
  })


  return (
    <calendarContext.Provider value={{isFrom, setDay, granularity}}>
      <Calendar {...props}
                initialFocus={initialFocus}
                mode="range"
                numberOfMonths={2}
                components={{
                  ...components,
                  Footer: DateTimePicker
                }}
      />
    </calendarContext.Provider>
  )
}

/**
 * 时间选择器
 * @constructor
 */
function DateTimePicker(
  {
    displayMonth,
  }: FooterProps) {
  const {selected, onSelect} = useDayPicker();
  const timeId = useId();
  const context = useContext(calendarContext);
  const granularity = context?.granularity || "second"

  const dateRange = selected as DateRange | undefined;
  const isFrom = context?.isFrom(timeId) || false;
  const date = (isFrom ? dateRange?.from : dateRange?.to);

  const activeModifiers = useActiveModifiers(date || new Date(), displayMonth);

  const day = !!displayMonth ? format(displayMonth, "yyyy-MM-dd") : undefined;
  useEffect(() => {
    if (!!day) {
      context?.setDay(timeId, day)
    }
  }, [day])

  const value = !!date ? {
    hour: parseInt(format(date, "HH")),
    minute: parseInt(format(date, "mm")),
    second: parseInt(format(date, "ss")),
  } as TimeValue : undefined

  function handleChange(value: TimeValue) {
    if (!date) return

    const onSelectHandler = onSelect as SelectRangeEventHandler | undefined;

    const newDate = parse(`${value.hour}:${value.minute}:${value.second}`, "HH:mm:ss", date || new Date());

    onSelectHandler?.(
      // @ts-ignore
      {...dateRange, ...(isFrom ? {from: newDate} : {to: newDate})},
      date || new Date(),
      activeModifiers,
      undefined
    )
  }

  return (
    <tfoot className={"sticky bottom-0"}>
    <tr>
      <td>
        <div className={"mt-2"}>
          {/*@ts-ignore*/}
          <TimeCalendar granularity={granularity} isDisabled={!date} value={value} onChange={handleChange}
          />
        </div>
      </td>
    </tr>
    </tfoot>
  )
}

export {DateTimeRangeCalendar}

import {CalendarIcon} from "lucide-react";
import React, {useCallback, useRef, useState} from "react";
import {DateValue, useButton, useDatePicker, useInteractOutside,} from "react-aria";
import {DatePickerStateOptions, useDatePickerState} from "react-stately";
import {useForwardedRef} from "@/components/hooks/use-forwarded-ref";
import {cn, fillZero, isBlank} from "@/lib/utils";
import {Button} from "@/components/ui/button";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover";
import {Calendar} from "./calendar";
import {DateField} from "./date-field";
import {TimeField} from "./time-field";
import {CalendarDate, CalendarDateTime} from "@internationalized/date";
import {MonthCalendar} from "@/components/custom-ui/date-time-picker/month-calendar.tsx";
import {useCreation} from "ahooks";
import dayjs from "dayjs";

/**
 * 日期时间选取器
 */
const DateTimePicker = React.forwardRef<
  HTMLDivElement,
  Omit<DatePickerStateOptions<DateValue>, "granularity" | "value" | "onChange"> & {
  className?: string,
  isEditing?: boolean,
  granularity?: 'month' | 'day' | 'hour' | 'minute' | 'second',
  value?: string,
  onChange?: (date: string | null) => void,
  align?: "start" | "center" | "end";
}>((
  {
    className,
    isEditing = true,
    granularity,
    value,
    onChange,
    align,
    ...props
  }, forwardedRef) => {
  const ref = useForwardedRef(forwardedRef);
  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const contentRef = useRef<HTMLDivElement | null>(null);

  // 时间值
  const dateValue = useCreation(() => {
    if (value) {
      if (isBlank(value)) return null
      if (granularity === 'month') {
        const date = dayjs(value, "YYYY-MM").toDate();
        return new CalendarDate(date.getFullYear(), date.getMonth(), 1);
      } else if (granularity === 'day') {
        const date = dayjs(value, "YYYY-MM-DD").toDate();
        return new CalendarDate(date.getFullYear(), date.getMonth(), date.getDay());
      } else if (granularity === 'hour') {
        const date = dayjs(value, "YYYY-MM-DD HH").toDate();
        return new CalendarDateTime(date.getFullYear(), date.getMonth(), date.getDay(), date.getHours());
      } else if (granularity === 'minute') {
        const date = dayjs(value, "YYYY-MM-DD HH:mm").toDate();
        return new CalendarDateTime(date.getFullYear(), date.getMonth(), date.getDay(), date.getHours(), date.getMinutes());
      } else if (granularity === 'second') {
        const date = dayjs(value, "YYYY-MM-DD HH:mm:ss").toDate();
        return new CalendarDateTime(date.getFullYear(), date.getMonth(), date.getDay(), date.getHours(), date.getMinutes(), date.getSeconds());
      }
    }
    return null
  }, [value]);

  // 处理时间变更
  const handleChange = useCallback((dateValue: DateValue | null) => {
    let value: string | null = null;

    if (!dateValue) {
      value = null
    } else if (granularity === 'month') {
      value = `${dateValue.year}-${fillZero(2, dateValue.month)}`;
    } else if (granularity === 'day') {
      value = `${dateValue.year}-${fillZero(2, dateValue.month)}-${fillZero(2, dateValue.day)}`;
    } else if (granularity === 'hour') {
      const dateTime = dateValue as CalendarDateTime;
      value = `${dateTime.year}-${fillZero(2, dateTime.month)}-${fillZero(2, dateTime.day)} ${fillZero(2, dateTime.hour)}`;
    } else if (granularity === 'minute') {
      const dateTime = dateValue as CalendarDateTime;
      value = `${dateTime.year}-${fillZero(2, dateTime.month)}-${fillZero(2, dateTime.day)} ${fillZero(2, dateTime.hour)}:${fillZero(2, dateTime.minute)}`;
    } else if (granularity === 'second') {
      const dateTime = dateValue as CalendarDateTime;
      value = `${dateTime.year}-${fillZero(2, dateTime.month)}-${fillZero(2, dateTime.day)} ${fillZero(2, dateTime.hour)}:${fillZero(2, dateTime.minute)}:${fillZero(2, dateTime.second)}`;
    }

    onChange?.(value);
  }, [onChange]);

  const [open, setOpen] = useState(false);

  const state = useDatePickerState({
    ...props,
    value: dateValue,
    onChange: handleChange,
    granularity: granularity === "month" ? "day" : granularity
  });

  const {
    groupProps,
    fieldProps,
    buttonProps: _buttonProps,
    dialogProps,
    calendarProps,
  } = useDatePicker({...props, value: dateValue, onChange: handleChange, label: "-"}, state, ref);

  const {buttonProps} = useButton(_buttonProps, buttonRef);

  useInteractOutside({
    ref: contentRef,
    onInteractOutside: (_e) => {
      setOpen(false);
    },
  });

  return (
    <div
      {...groupProps}
      ref={ref}
      className={cn(
        groupProps.className,
        "flex items-center rounded-md ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
        className
      )}
    >
      <DateField {...fieldProps} granularity={granularity} isEditing={isEditing}/>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            {...buttonProps}
            variant="outline"
            className={cn("rounded-l-none", !isEditing && "bg-transparent border-none")}
            disabled={props.isDisabled}
            onClick={() => setOpen(true)}
          >
            <CalendarIcon className="h-5 w-5"/>
          </Button>
        </PopoverTrigger>
        <PopoverContent ref={contentRef} className="w-full" align={align}>
          <div {...dialogProps} className="space-y-3">
            {granularity === "month" && (
              <MonthCalendar
                selectedMonth={calendarProps.value ? new Date(calendarProps.value.year, calendarProps.value.month) : undefined}
                onMonthSelect={(date) => {
                  calendarProps.onChange?.(new CalendarDate(date.getFullYear(), date.getMonth(), 1));
                }}
              />
            )}
            {granularity !== "month" && (
              <>
                <Calendar {...calendarProps} />
                {/*@ts-ignore*/}
                {state.hasTime && (<TimeField onChange={state.setTimeValue}
                                              granularity={granularity === "day" ? undefined : granularity}
                                              value={state.timeValue}/>)
                }
              </>
            )}
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
});

DateTimePicker.displayName = "DateTimePicker";

export {DateTimePicker};

import {DateSegment} from "./date-segment";
import {createCalendar} from "@internationalized/date";
import {useMemo, useRef} from "react";
import {
  AriaDatePickerProps,
  DateValue,
  useDateField,
  useLocale,
} from "react-aria";
import {useDateFieldState} from "react-stately";
import {cn} from "@/lib/utils";

function DateField(
  {
    className,
    isEditing = true,
    granularity,
    ...props
  }: Omit<AriaDatePickerProps<DateValue>, "granularity"> & {
    className?: string, isEditing?: boolean, granularity?: 'month' | 'day' | 'hour' | 'minute' | 'second'
  }) {
  const ref = useRef<HTMLDivElement | null>(null);

  const {locale} = useLocale();
  const state = useDateFieldState({
    ...props,
    granularity: granularity === "month" ? "day" : granularity,
    locale,
    createCalendar,
  });
  const {fieldProps} = useDateField({...props, label: "-"}, state, ref);

  const segments = useMemo(() => {
    if (granularity === "month") {
      return state.segments.slice(0, state.segments.length - 2);
    } else {
      return state.segments
    }
  }, [state, granularity])

  return (
    <div
      {...fieldProps}
      ref={ref}
      className={cn(
        "inline-flex h-10 flex-1 items-center rounded-l-md border border-r-0 border-input bg-transparent py-2 pl-3 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        props.isDisabled ? "cursor-not-allowed opacity-50" : "",
        !isEditing && "bg-transparent border-none",
        className,
      )}
    >
      {segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state}/>
      ))}
      {state.isInvalid && (
        <span aria-hidden="true">🚫</span>
      )}
    </div>
  );
}

export {DateField};

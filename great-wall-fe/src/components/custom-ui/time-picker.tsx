import {forwardRef, useRef} from "react";
import {DateFieldState, DateSegment as IDateSegment, TimeFieldStateOptions, useTimeFieldState} from "react-stately";
import {cn} from "@/utils/shadcnUtils";
import {AriaTimeFieldProps, TimeValue, useDateSegment, useLocale, useTimeField} from "react-aria";

interface DateSegmentProps {
  segment: IDateSegment;
  state: DateFieldState;
}

function DateSegment({segment, state}: DateSegmentProps) {
  const ref = useRef(null);

  const {
    segmentProps: {...segmentProps},
  } = useDateSegment(segment, state, ref);

  return (
    <div
      {...segmentProps}
      ref={ref}
      className={cn(
        "focus:rounded-[2px] focus:bg-accent focus:text-accent-foreground focus:outline-none",
        segment.type !== "literal" ? "px-[1px]" : "",
        segment.isPlaceholder ? "text-muted-foreground" : ""
      )}
    >
      {segment.text}
    </div>
  );
}

function TimeField(props: AriaTimeFieldProps<TimeValue>) {
  const ref = useRef<HTMLDivElement>(null);

  const {locale} = useLocale();
  const state = useTimeFieldState({
    ...props,
    locale,
  });

  const {fieldProps: {...fieldProps}} = useTimeField(props, state, ref);

  return (
    <div
      {...fieldProps}
      ref={ref}
      className={cn(
        "inline-flex h-10 w-full flex-1 rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
        props.isDisabled ? "cursor-not-allowed opacity-50" : "",
      )}
    >
      {state.segments.map((segment, i) => (
        <DateSegment key={i} segment={segment} state={state}/>
      ))}
    </div>
  );
}

const TimePicker = forwardRef<
  HTMLDivElement,
  Omit<TimeFieldStateOptions<TimeValue>, "locale">
>((props, _ref) => {
  return <TimeField aria-label={"time"} {...props} />;
});

TimePicker.displayName = "TimePicker";


export {
  DateSegment,
  TimeField,
  TimePicker
}
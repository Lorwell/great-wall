import {useRef} from "react";
import {useDateSegment} from "react-aria";
import {DateFieldState, DateSegment as IDateSegment} from "react-stately";
import {cn, fillZero, isToInt} from "@/lib/utils";
import {useCreation} from "ahooks";

interface DateSegmentProps {
  segment: IDateSegment;
  state: DateFieldState;
}

function DateSegment({segment, state}: DateSegmentProps) {
  const ref = useRef(null);

  const {
    segmentProps: {...segmentProps},
  } = useDateSegment(segment, state, ref);


  const text = useCreation(() => {
    const text = segment.text;
    switch (segment.type) {
      case "era":
      case "dayPeriod":
      case "literal":
      case "timeZoneName":
        return text
      case "year":
        if (isToInt(text)) {
          return fillZero(4, text)
        }
        break
      case "month":
      case "day":
      case "hour":
      case "minute":
      case "second":
        if (isToInt(text)) {
          return fillZero(2, text)
        }
    }

    return text
  }, [segment]);


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
      {text}
    </div>
  );
}

export {DateSegment};

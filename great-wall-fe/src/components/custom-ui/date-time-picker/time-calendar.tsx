import React from "react";
import {TimeFieldStateOptions} from "react-stately";
import {TimeField} from "./time-field";

const TimeCalendar = React.forwardRef<
  HTMLDivElement,
  Omit<TimeFieldStateOptions, "locale">
>((props, _forwardedRef) => {
  return <TimeField {...props} />;
});

TimeCalendar.displayName = "TimePicker";

export {TimeCalendar};

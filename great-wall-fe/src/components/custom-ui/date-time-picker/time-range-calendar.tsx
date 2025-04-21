import React, {useEffect, useMemo, useState} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue,} from "@/components/ui/select";
import {Button, ButtonProps} from "@/components/ui/button";
import {cn} from "@/lib/utils";
import {DateRange} from "react-day-picker";
import {useControllableValue} from "ahooks";
import {format, parse} from "date-fns";

const generateTimeOptions = (
  granularity: 'hour' | 'minute' | 'second',
  step: number) => {
  const options: string[] = [];

  if (granularity === 'hour') {
    for (let hour = 0; hour < 24; hour++) {
      const time = `${hour.toString().padStart(2, "0")}`;
      options.push(time);
    }
  } else if (granularity === 'minute') {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += step) {
        const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}`;
        options.push(time);
      }
    }
  } else {
    for (let hour = 0; hour < 24; hour++) {
      for (let minute = 0; minute < 60; minute += step) {
        for (let seconds = 0; seconds < 60; seconds += step) {
          const time = `${hour.toString().padStart(2, "0")}:${minute.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
          options.push(time);
        }
      }
    }
  }

  return options;
};

export interface TimeRangePickerProps {
  value?: DateRange
  onChange?: (value?: DateRange | null | undefined) => void;
  sort?: boolean;
  showApplyButton?: boolean;
  applyButtonText?: string;
  startTimeLabel?: string;
  startTimePlaceholder?: string;
  endTimeLabel?: string;
  endTimePlaceholder?: string;
  step?: number;
  buttonProps?: ButtonProps;
  labelClassName?: string;
  // 精确到哪里
  granularity?: 'hour' | 'minute' | 'second',
}

/**
 * 时间范围日历
 * @constructor
 */
const TimeRangeCalendar: React.FC<TimeRangePickerProps> = (props) => {
  const {
    sort = true,
    showApplyButton = true,
    applyButtonText = "确认",
    startTimeLabel = "开始时间",
    startTimePlaceholder = "选择开始时间",
    endTimeLabel = "结束时间",
    endTimePlaceholder = "选择结束时间",
    step = 15,
    buttonProps,
    labelClassName,
    granularity = "second"
  } = props;

  const [data, setDate] = useControllableValue<DateRange>(props, {
    valuePropName: "value",
    trigger: "onChange",
  });

  const pattern = useMemo(() => {
    if (granularity === 'hour') {
      return "HH"
    } else if (granularity === 'minute') {
      return "HH:mm"
    } else if (granularity === 'second') {
      return "HH:mm:ss"
    }
    return "HH:mm:ss"
  }, [granularity]);

  const [startTime, setStartTime] = useState(() => format(data?.from || new Date(), pattern));
  const [endTime, setEndTime] = useState(() => format(data?.to || new Date(), pattern));

  const timeOptions = useMemo(() => generateTimeOptions(granularity, step), [granularity, step]);

  const sortTimes = (start: string, end: string): [string, string] => {
    return start <= end ? [start, end] : [end, start];
  };

  const formatTimeRange = (start: string, end: string): DateRange => {
    const from = parse(start, pattern, new Date())
    const to = parse(end, pattern, new Date())
    return {from, to}
  }

  const handleTimeChange = (newStartTime: string, newEndTime: string) => {
    const [sortedStart, sortedEnd] = sort ? sortTimes(newStartTime, newEndTime) : [newStartTime, newEndTime];

    setStartTime(sortedStart);
    setEndTime(sortedEnd);

    if (!showApplyButton) {
      setDate?.(formatTimeRange(sortedStart, sortedEnd));
    }
  };

  useEffect(() => {
    if (sort) {
      const [sortedStart, sortedEnd] = sortTimes(startTime, endTime);
      setStartTime(sortedStart);
      setEndTime(sortedEnd);

      if (!showApplyButton) {
        setDate?.(formatTimeRange(sortedStart, sortedEnd));
      }
    }
  }, [sort, startTime, endTime, showApplyButton, setDate]);

  const handleApply = () => {
    setDate?.(formatTimeRange(startTime, endTime));
  };

  return (
    <div
      className={cn(
        "flex flex-col gap-4 "
      )}
    >
      <div
        className={cn(
          "flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0"
        )}
      >
        <div className="flex flex-col space-y-2 items-center justify-center">
          {startTimeLabel && (
            <label htmlFor="start-time" className={labelClassName}>
              {startTimeLabel}
            </label>
          )}
          <Select
            value={startTime}
            onValueChange={(value) => handleTimeChange(value, endTime)}
          >
            <SelectTrigger id="start-time" className="w-32">
              <SelectValue placeholder={startTimePlaceholder}/>
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {timeOptions.map((time) => (
                <SelectItem key={`start-${time}`} value={time}>
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex flex-col space-y-2 items-center justify-center">
          {endTimeLabel && (
            <label htmlFor="end-time" className={labelClassName}>
              {endTimeLabel}
            </label>
          )}
          <Select
            value={endTime}
            onValueChange={(value) => handleTimeChange(startTime, value)}
          >
            <SelectTrigger id="end-time" className="w-32">
              <SelectValue placeholder={endTimePlaceholder}/>
            </SelectTrigger>
            <SelectContent className="max-h-[200px] overflow-y-auto">
              {timeOptions.map((time) => (
                <SelectItem
                  key={`end-${time}`}
                  value={time}
                >
                  {time}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      {showApplyButton && (
        <Button
          onClick={handleApply}
          className={cn(
            "w-full sm:w-auto mt-auto",
            buttonProps?.className
          )}
          {...buttonProps}
        >
          {applyButtonText}
        </Button>
      )}
    </div>
  );
};

export default TimeRangeCalendar;

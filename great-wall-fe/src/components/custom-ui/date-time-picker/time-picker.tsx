/**
 * Simple Time Picker
 * Check out the live demo at https://shadcn-datetime-picker-pro.vercel.app/
 * Find the latest source code at https://github.com/huybuidac/shadcn-datetime-picker
 */
import {forwardRef, useCallback, useEffect, useMemo, useRef, useState} from 'react';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import {cn} from '@/lib/utils';
import {CheckIcon, Clock, X} from 'lucide-react';
import {Button} from '@/components/ui/button';
import {ScrollArea} from '@/components/ui/scroll-area';
import {
  endOfHour,
  endOfMinute,
  format,
  parse,
  setHours,
  setMilliseconds,
  setMinutes,
  setSeconds,
  startOfHour,
  startOfMinute,
} from 'date-fns';

interface SimpleTimeOption {
  value: any;
  label: string;
  disabled?: boolean;
}

export type TimePickerProps = {
  value?: string;
  onChange?: (date: string | null | undefined) => void;
  min?: Date;
  max?: Date;
  disabled?: boolean;
  className?: string;
  modal?: boolean;
  // 精确到哪里
  granularity?: 'hour' | 'minute' | 'second',
}

const granularityLevel = {
  hour: 1,
  minute: 2,
  second: 3,
}

/**
 * 时间选择器
 * @constructor
 */
export const TimePicker = forwardRef<HTMLDivElement, TimePickerProps>((
  {
    value,
    onChange,
    min,
    max,
    disabled,
    modal,
    granularity = 'second',
  }, ref) => {

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

  const date = useMemo(() => value ? parse(value, pattern, new Date()) : null, [value, pattern]);

  const [hour, setHour] = useState(date?.getHours());
  const [minute, setMinute] = useState(date?.getMinutes());
  const [second, setSecond] = useState(date?.getSeconds());
  const level = useMemo(() => granularityLevel[granularity], [granularity]);

  const [hourView, minuteView, secondView] = useMemo(() => {
    const currentDate = new Date();
    return [hour || currentDate.getHours(), minute || currentDate.getMinutes(), second || currentDate.getSeconds()]
  }, [hour, minute, second]);

  useEffect(() => {
    const hourNum = level >= granularityLevel["hour"] ? hour : undefined;
    const minuteNum = level >= granularityLevel["minute"] ? minute : undefined;
    const secondNum = level >= granularityLevel["second"] ? second : undefined;

    let dateValue = null
    if (hourNum || hourNum === 0 || minuteNum || minuteNum === 0 || secondNum || secondNum === 0) {
      dateValue = buildTime({value: date || new Date(), hour: hourNum, minute: minuteNum, second: secondNum});
    }

    onChange?.(dateValue ? format(dateValue, pattern) : null);
  }, [hour, minute, second, level, onChange, date, pattern]);

  const hours: SimpleTimeOption[] = useMemo(() =>
      Array.from({length: 24}, (_, i) => {
        let disabled = false;
        const hourValue = i;
        const hDate = setHours(date || new Date(), i);
        const hStart = startOfHour(hDate);
        const hEnd = endOfHour(hDate);
        if (min && hEnd < min) disabled = true;
        if (max && hStart > max) disabled = true;
        return {
          value: hourValue,
          label: hourValue.toString().padStart(2, '0'),
          disabled,
        };
      }),
    [date, min, max]
  );

  const minutes: SimpleTimeOption[] = useMemo(() => {
    const currentDate = new Date();
    const anchorDate = setHours(date || currentDate, hour || currentDate.getHours());
    return Array.from({length: 60}, (_, i) => {
      let disabled = false;
      const mDate = setMinutes(anchorDate, i);
      const mStart = startOfMinute(mDate);
      const mEnd = endOfMinute(mDate);
      if (min && mEnd < min) disabled = true;
      if (max && mStart > max) disabled = true;
      return {
        value: i,
        label: i.toString().padStart(2, '0'),
        disabled,
      };
    });
  }, [date, min, max, hour]);

  const seconds: SimpleTimeOption[] = useMemo(() => {
    const currentDate = new Date();
    const anchorDate = setMilliseconds(setMinutes(setHours(date || currentDate, hour || currentDate.getHours()), minute || currentDate.getMinutes()), 0);
    const _min = min ? setMilliseconds(min, 0) : undefined;
    const _max = max ? setMilliseconds(max, 0) : undefined;
    return Array.from({length: 60}, (_, i) => {
      let disabled = false;
      const sDate = setSeconds(anchorDate, i);
      if (_min && sDate < _min) disabled = true;
      if (_max && sDate > _max) disabled = true;
      return {
        value: i,
        label: i.toString().padStart(2, '0'),
        disabled,
      };
    });
  }, [date, minute, min, max, hour]);

  const [open, setOpen] = useState(false);

  const hourRef = useRef<HTMLDivElement>(null);
  const minuteRef = useRef<HTMLDivElement>(null);
  const secondRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (open) {
        hourRef.current?.scrollIntoView({behavior: 'auto'});
        minuteRef.current?.scrollIntoView({behavior: 'auto'});
        secondRef.current?.scrollIntoView({behavior: 'auto'});
      }
    }, 1);
    return () => clearTimeout(timeoutId);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const onHourChange = useCallback((v: SimpleTimeOption) => {
      const currentDate = new Date();
      if (min) {
        let newTime = buildTime({value: date, hour: v.value, minute, second}) || currentDate;
        if (newTime < min) {
          setMinute(min.getMinutes());
          setSecond(min.getSeconds());
        }
      }
      if (max) {
        let newTime = buildTime({value: date, hour: v.value, minute, second}) || currentDate;
        if (newTime > max) {
          setMinute(max.getMinutes());
          setSecond(max.getSeconds());
        }
      }
      setHour(v.value);
    },
    [setHour, date, minute, second]
  );

  const onMinuteChange = useCallback((v: SimpleTimeOption) => {
      const currentDate = new Date();
      if (min) {
        let newTime = buildTime({value: date, hour: v.value, minute, second}) || currentDate;
        if (newTime < min) {
          setSecond(min.getSeconds());
        }
      }
      if (max) {
        let newTime = buildTime({value: date, hour: v.value, minute, second}) || currentDate;
        if (newTime > max) {
          setSecond(newTime.getSeconds());
        }
      }
      setMinute(v.value);
    },
    [setMinute, date, hour, second]
  );

  const display = useMemo(() => {
    return date ? format(date, pattern) : null;
  }, [date, pattern]);

  const defaultDisplay = useMemo(() => {
    if (granularity === 'hour') {
      return "时"
    } else if (granularity === 'minute') {
      return "时:分"
    } else if (granularity === 'second') {
      return "时:分:秒"
    }
    return "时:分:秒"
  }, [granularity]);

  return (
    <Popover open={open} onOpenChange={setOpen} modal={modal}>
      <PopoverTrigger asChild>
        <div
          role="combobox"
          aria-expanded={open}
          className={cn(
            'flex h-9 px-3 items-center justify-between cursor-pointer font-normal border border-input rounded-md text-sm shadow-sm',
            disabled && 'opacity-50 cursor-not-allowed'
          )}
          tabIndex={0}
          ref={ref}
        >
          {display || defaultDisplay}
          {display && (
            <X className="mr-2 size-4"
               onClick={(e) => {
                 e.stopPropagation()
                 e.preventDefault()
                 setHour(undefined)
                 setMinute(undefined)
                 setSecond(undefined)
               }}/>
          )}
          {!display && (<Clock className="mr-2 size-4"/>)}
        </div>
      </PopoverTrigger>
      <PopoverContent className="p-0" side="top">
        <div className="flex-col gap-2 p-2">
          <div className="flex h-56 grow">
            {level >= granularityLevel["hour"] && (
              <ScrollArea className="h-56 flex-grow">
                <div className="flex grow flex-col items-stretch overflow-y-auto pe-2 pb-48">
                  {hours.map((v) => (
                    <div ref={v.value === hourView ? hourRef : undefined} key={v.value}>
                      <TimeItem
                        option={v}
                        selected={v.value === hourView}
                        onSelect={onHourChange}
                        disabled={v.disabled}
                        className="h-8"
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
            {level >= granularityLevel["minute"] && (
              <ScrollArea className="h-56 flex-grow">
                <div className="flex grow flex-col items-stretch overflow-y-auto pe-2 pb-48">
                  {minutes.map((v) => (
                    <div ref={v.value === minuteView ? minuteRef : undefined} key={v.value}>
                      <TimeItem
                        option={v}
                        selected={v.value === minuteView}
                        onSelect={onMinuteChange}
                        disabled={v.disabled}
                        className="h-8"
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
            {level >= granularityLevel["second"] && (
              <ScrollArea className="h-56 flex-grow">
                <div className="flex grow flex-col items-stretch overflow-y-auto pe-2 pb-48">
                  {seconds.map((v) => (
                    <div ref={v.value === secondView ? secondRef : undefined} key={v.value}>
                      <TimeItem
                        option={v}
                        selected={v.value === secondView}
                        onSelect={(v) => setSecond(v.value)}
                        className="h-8"
                        disabled={v.disabled}
                      />
                    </div>
                  ))}
                </div>
              </ScrollArea>
            )}
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
});

const TimeItem = (
  {
    option,
    selected,
    onSelect,
    className,
    disabled,
  }: {
    option: SimpleTimeOption;
    selected: boolean;
    onSelect: (option: SimpleTimeOption) => void;
    className?: string;
    disabled?: boolean;
  }) => {
  return (
    <Button
      variant="ghost"
      className={cn('flex justify-center px-1 pe-2 ps-1', className)}
      onClick={() => onSelect(option)}
      disabled={disabled}
    >
      <div className="w-4">{selected && <CheckIcon className="my-auto size-4"/>}</div>
      <span className="ms-2">{option.label}</span>
    </Button>
  );
};

interface BuildTimeOptions {
  value?: Date | null | undefined;
  hour?: number;
  minute?: number;
  second?: number;
}

function buildTime(options: BuildTimeOptions): Date | null {
  let {value, hour, minute, second} = options;
  if (!value) return null

  value = setMilliseconds(value, 0);
  value = second || second === 0 ? setSeconds(value, second) : value
  value = minute || minute === 0 ? setMinutes(value, minute) : value
  return hour || hour === 0 ? setHours(value, hour) : value
}

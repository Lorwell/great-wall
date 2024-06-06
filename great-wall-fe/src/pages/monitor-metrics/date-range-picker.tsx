import * as React from "react"
import {CalendarIcon} from "@radix-ui/react-icons"
import {addMinutes, format} from "date-fns"
import {DateRange} from "react-day-picker"
import {cn} from "@/utils/shadcnUtils.ts"
import {Button} from "@/components/ui/button.tsx";
import {Popover, PopoverContent, PopoverTrigger} from "@/components/ui/popover.tsx";
import {Calendar} from "@/components/ui/calendar.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

/**
 * 日历日期范围选择器
 *
 * @param className
 * @constructor
 */
export function CalendarDateRangePicker({
                                          className,
                                        }: React.HTMLAttributes<HTMLDivElement>) {
  const [date, setDate] = React.useState<DateRange | undefined>({
    from: addMinutes(new Date(), -15),
  })

  return (
    <div className={cn("grid gap-2", className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={"outline"}
            className={cn(
              " justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4"/>
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "yyyy-MM-dd HH:mm:ss")} -{" "}
                  {format(date.to, "yyyy-MM-dd HH:mm:ss")}
                </>
              ) : (
                <>
                  {format(date.from, "yyyy-MM-dd HH:mm:ss")} - 至今
                </>
              )
            ) : (
              <span>选择时间</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="flex w-auto flex-col space-y-2 p-2">
          <Select
            onValueChange={(value) => {
              setDate({from: addMinutes(new Date(), -parseInt(value))})
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select"/>
            </SelectTrigger>
            <SelectContent position="popper">
              <SelectItem value="15">近15分钟</SelectItem>
              <SelectItem value="30">近30分钟</SelectItem>
              <SelectItem value="60">近1小时</SelectItem>
              <SelectItem value="180">近3小时</SelectItem>
              <SelectItem value="360">近6小时</SelectItem>
              <SelectItem value="720">近12小时</SelectItem>
              <SelectItem value="2160">近3天</SelectItem>
              <SelectItem value="5040">近7天</SelectItem>
              <SelectItem value="10800">近15天</SelectItem>
            </SelectContent>
          </Select>
          <div className="rounded-md border">
            <Calendar
              initialFocus
              mode="range"
              defaultMonth={date?.from}
              selected={date}
              onSelect={setDate}
              numberOfMonths={2}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

import {CheckIcon, PlusCircledIcon} from "@radix-ui/react-icons"
import {Column} from "@tanstack/react-table"
import {cn, isNull} from "@/lib/utils.ts"
import {Badge} from "@/components/ui/badge.tsx"
import {Button} from "@/components/ui/button.tsx"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command.tsx"
import {Popover, PopoverContent, PopoverTrigger,} from "@/components/ui/popover.tsx"
import {Separator} from "@/components/ui/separator.tsx"
import {isArray} from "radash";
import {useCreation} from "ahooks";
import {
  DataTableFilter,
  DateTimeFilterOptions,
  DateTimeFormatEnum,
  EnumFilterOptions,
  NumberFilterOptions,
  StringFilterOptions
} from "./types.ts";
import {
  getMetricsDateTimeLabel,
  MetricsDateTimeRange
} from "@/components/custom-ui/date-time-picker/metrics-date-time-range-calendar.tsx";
import dayjs from "dayjs";
import {getMetricsDateLabel, MetricsDateRange} from "../date-time-picker/metrics-date-range-calendar.tsx"
import {DateRange} from "react-day-picker";
import {DateTimeCalendarFilter} from "@/components/custom-ui/data-table/date-time-calendar-filter.tsx";
import {useState} from "react";
import {NumberFormData, NumberFormFilter} from "@/components/custom-ui/data-table/number-form-filter.tsx";
import {StringFormData, StringFormFilter} from "@/components/custom-ui/data-table/string-form-filter.tsx";
import {Brackets, CalendarSearch, Search} from "lucide-react"

interface DataTableFacetedFilterProps<TData, TValue> {
  column: Column<TData, TValue>
  label?: string
  filter: DataTableFilter
}

/**
 * 数据表过滤器
 * @constructor
 */
export function DataTableFacetedFilter<TData, TValue>(
  {
    filter,
    ...props
  }: DataTableFacetedFilterProps<TData, TValue>) {

  if (filter.type === "Enum") {
    return (
      <EnumFacetedFilter {...props} filter={filter}/>
    )
  } else if (filter.type === "DateTime") {
    return (
      <DateTimeFacetedFilter {...props} filter={filter}/>
    )
  } else if (filter.type === "Number") {
    return (
      <NumberFacetedFilter {...props} filter={filter}/>
    )
  } else if (filter.type === "String") {
    return (
      <StringFacetedFilter {...props} filter={filter}/>
    )
  }

  return null;
}

/**
 * 字符过滤器
 */
function StringFacetedFilter(
  {
    column,
    label,
    filter,
  }: Omit<DataTableFacetedFilterProps<any, any>, "filter"> & { filter: StringFilterOptions }) {
  const [open, setOpen] = useState<boolean>(false)

  const filterValue = column.getFilterValue() as StringFormData | undefined;
  const text = useCreation(() => {
    if (!filterValue) return ""
    const {query} = filterValue
    return `模糊搜索：${query}`
  }, [filterValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Search className="mr-2 h-4 w-4"/>
          {label}
          <Separator orientation="vertical" className="mx-2 h-4"/>
          {text}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit" align="start">
        <StringFormFilter filter={filter} column={column} onSubmit={() => setOpen(false)}/>
      </PopoverContent>
    </Popover>
  )
}

/**
 * 数值过滤器
 */
function NumberFacetedFilter(
  {
    column,
    label,
    filter,
  }: Omit<DataTableFacetedFilterProps<any, any>, "filter"> & { filter: NumberFilterOptions }) {
  const [open, setOpen] = useState<boolean>(false)

  const filterValue = column.getFilterValue() as NumberFormData | undefined;

  const text = useCreation(() => {
    if (!filterValue) return ""
    const {min, max} = filterValue
    if ((min || min === 0) && (max || max === 0)) {
      return `大于 ${min} 小于 ${max}`
    } else if (min || min === 0) {
      return `大于 ${min}`
    } else if (max || max === 0) {
      return `小于 ${max}`
    } else {
      return ""
    }
  }, [filterValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <Brackets className="mr-2 h-4 w-4"/>
          {label}
          <Separator orientation="vertical" className="mx-2 h-4"/>
          {text}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-fit" align="start">
        <NumberFormFilter filter={filter} column={column} onSubmit={() => setOpen(false)}/>
      </PopoverContent>
    </Popover>
  )
}

/**
 * 时间过滤器
 */
function DateTimeFacetedFilter(
  {
    column,
    label,
    filter,
  }: Omit<DataTableFacetedFilterProps<any, any>, "filter"> & { filter: DateTimeFilterOptions }) {
  const [open, setOpen] = useState<boolean>(false)
  const filterValue = column?.getFilterValue()

  const text = useCreation(() => {
    if (!filterValue) return "";

    let format = "YYYY-MM-DD HH:mm:ss"
    let dateRange: DateRange | undefined = undefined

    // 年月
    if (filter.format === DateTimeFormatEnum.YEAR_MONTH) {
      format = "YYYY-MM"
      dateRange = filterValue as DateRange
    }
    // 年月日
    else if (filter.format === DateTimeFormatEnum.DATE) {
      const value = filterValue as MetricsDateRange;
      if (value.type === "MetricsDateEnum") {
        return getMetricsDateLabel(value.lastDataEnum!!) || ""
      } else {
        format = "YYYY-MM-DD"
        dateRange = value.dateRange
      }
    }
    // 时分
    else if (filter.format === DateTimeFormatEnum.HOUR_MINUTE) {
      format = "HH:mm"
      dateRange = filterValue as DateRange
    }
    // 时分秒
    else if (filter.format === DateTimeFormatEnum.TIME) {
      format = "HH:mm:ss"
      dateRange = filterValue as DateRange
    }
    // 带时间的
    else {
      const value = filterValue as MetricsDateTimeRange
      if (value.type === "MetricsDateTime") {
        return getMetricsDateTimeLabel(value.metricsDateTime!!) || ""
      } else {

        switch (filter.format) {
          case DateTimeFormatEnum.YEAR_MONTH_DAY_HOUR:
            format = "YYYY-MM-DD HH"
            break;
          case DateTimeFormatEnum.YEAR_MONTH_DAY_HOUR_MINUTE:
            format = "YYYY-MM-DD HH:mm"
            break;
          case DateTimeFormatEnum.TIMESTAMP:
            format = "YYYY-MM-DD HH:mm:ss"
            break;
        }
        dateRange = value.dateRange
      }
    }

    if (dateRange) {
      const toText = dateRange.to ? dayjs(dateRange.to).format(format) : "至今";
      return `${dayjs(dateRange.from).format(format)} - ${toText}`
    } else {
      return ""
    }
  }, [filterValue]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <CalendarSearch className="mr-2 h-4 w-4"/>
          {label}
          <Separator orientation="vertical" className="mx-2 h-4"/>
          {text}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={"w-fit"} align={"start"}>
        <DateTimeCalendarFilter filter={filter} column={column} onSelected={() => setOpen(false)}/>
      </PopoverContent>
    </Popover>
  )
}

/**
 * 枚举过滤器
 */
function EnumFacetedFilter(
  {
    column,
    label,
    filter,
  }: Omit<DataTableFacetedFilterProps<any, any>, "filter"> & { filter: EnumFilterOptions }) {
  const facets = column?.getFacetedUniqueValues()

  const filterValue = column?.getFilterValue()

  const optionsValues = useCreation(() => {
    let value: any[]
    if (isNull(filterValue)) {
      value = []
    } else if (isArray(filterValue)) {
      value = [...filterValue]
    } else {
      value = [filterValue]
    }
    return new Set(value)
  }, [filterValue])

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 border-dashed">
          <PlusCircledIcon className="mr-2 h-4 w-4"/>
          {label}

          {optionsValues?.size > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 h-4"/>
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {optionsValues.size}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {optionsValues.size > 2 ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {optionsValues.size} 已选择
                  </Badge>
                ) : (
                  filter.options.filter((option) => optionsValues.has(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[200px] p-0" align="start">
        <Command>
          <CommandInput placeholder={label}/>
          <CommandList>
            <CommandEmpty>未找到结果</CommandEmpty>
            <CommandGroup>
              {filter.options.map((option) => {
                const isSelected = optionsValues.has(option.value)
                return (
                  <CommandItem
                    key={option.value}
                    onSelect={() => {
                      if (isSelected) {
                        optionsValues.delete(option.value)
                      } else {
                        optionsValues.add(option.value)
                      }
                      const filterValues = Array.from(optionsValues)
                      column?.setFilterValue(
                        filterValues.length ? filterValues : undefined
                      )
                    }}
                  >
                    <div
                      className={cn(
                        "mr-2 flex h-4 w-4 items-center justify-center rounded-sm border border-primary",
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "opacity-50 [&_svg]:invisible"
                      )}
                    >
                      <CheckIcon className={cn("h-4 w-4")}/>
                    </div>
                    {option.icon && (
                      <option.icon className="mr-2 h-4 w-4 text-muted-foreground"/>
                    )}
                    <span>{option.label}</span>
                    {facets?.get(option.value) && (
                      <span
                        className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                        {facets.get(option.value)}
                      </span>
                    )}
                  </CommandItem>
                )
              })}
            </CommandGroup>
            {optionsValues.size > 0 && (
              <>
                <CommandSeparator/>
                <CommandGroup>
                  <CommandItem
                    onSelect={() => column?.setFilterValue(undefined)}
                    className="justify-center text-center"
                  >
                    清除筛选条件
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}

import {Column, Table} from "@tanstack/react-table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {Filter} from "lucide-react";
import {cn} from "@/lib/utils.ts";
import {
  DataTableFilter,
  DateTimeFilterOptions,
  EnumFilterOptions,
  NumberFilterOptions,
  StringFilterOptions
} from "./types.ts";
import {Fragment, useState} from "react";
import {DateTimeCalendarFilter} from "@/components/custom-ui/data-table/date-time-calendar-filter.tsx";
import {NumberFormFilter} from "@/components/custom-ui/data-table/number-form-filter.tsx";
import {StringFormFilter} from "@/components/custom-ui/data-table/string-form-filter.tsx";


interface DataTableFilterOptionsProps<TData> {
  table: Table<TData>
  filters: DataTableFilter[]
}

/**
 * 过滤属性
 * @param props
 * @constructor
 */
function DataTableFilterOptions<TData>(props: DataTableFilterOptionsProps<TData>) {
  const {table, filters} = props;
  const [open, setOpen] = useState<boolean>(false)


  const disabled = filters.length === 0;

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Filter className={cn("cursor-pointer h-5 w-5",
          {
            "opacity-50": disabled
          })}
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[150px]">
        <DropdownMenuLabel>过滤</DropdownMenuLabel>
        <DropdownMenuSeparator/>

        <div className={"max-h-[50vh] overflow-y-auto"}>
          {
            filters.map(filter => {
              const type = filter.type;
              const column = table.getColumn(filter.columnId);

              return column && (
                <Fragment key={filter.columnId}>
                  {type === "Enum" && (<EnumFilter options={filter} column={column}/>)}
                  {type === "DateTime" && (
                    <DateTimeFilter filter={filter} column={column} onClose={() => setOpen(false)}/>
                  )}
                  {type === "Number" && (
                    <NumberFilter filter={filter} column={column} onClose={() => setOpen(false)}/>
                  )}
                  {type === "String" && (
                    <StringFilter filter={filter} column={column} onClose={() => setOpen(false)}/>
                  )}
                </Fragment>
              )
            })
          }
        </div>


        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick={() => table.resetColumnFilters()}>
          取消过滤条件
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}


/**
 * 字符过滤器
 */
function StringFilter(
  {
    filter,
    column,
    onClose
  }: { filter: StringFilterOptions, column: Column<any>, onClose: () => void }) {

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        {filter.label || column.id}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <StringFormFilter filter={filter} column={column} onSubmit={onClose}/>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}

/**
 * 时间过滤器
 */
function NumberFilter(
  {
    filter,
    column,
    onClose
  }: { filter: NumberFilterOptions, column: Column<any>, onClose: () => void }) {

  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        {filter.label || column.id}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <NumberFormFilter filter={filter} column={column} onSubmit={onClose}/>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}

/**
 * 时间过滤器
 */
function DateTimeFilter(
  {
    filter,
    column,
    onClose
  }: { filter: DateTimeFilterOptions, column: Column<any>, onClose: () => void }) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        {filter.label || column.id}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        <DateTimeCalendarFilter filter={filter} column={column} onSelected={onClose}/>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}

/**
 * 枚举过滤器
 */
function EnumFilter({options, column}: { options: EnumFilterOptions, column: Column<any> }) {
  return (
    <DropdownMenuSub>
      <DropdownMenuSubTrigger>
        {options.label || column.id}
      </DropdownMenuSubTrigger>
      <DropdownMenuSubContent>
        {/*@ts-ignore*/}
        <DropdownMenuRadioGroup value={column.getFilterValue()}>
          {
            options.options.map((option, index) => (
              <DropdownMenuRadioItem
                key={index}
                value={option.value}
                onClick={() => column.setFilterValue(option.value)}
              >
                {
                  option.icon && (
                    <option.icon
                      className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"
                    />
                  )
                }

                {option.label}
              </DropdownMenuRadioItem>
            ))
          }
        </DropdownMenuRadioGroup>
      </DropdownMenuSubContent>
    </DropdownMenuSub>
  )
}

export default DataTableFilterOptions

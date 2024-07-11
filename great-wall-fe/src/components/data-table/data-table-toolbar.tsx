import {Cross2Icon} from "@radix-ui/react-icons"
import {Table} from "@tanstack/react-table"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {DataTableViewOptions} from "./data-table-view-options"
import {DataTableFacetedFilter} from "./data-table-faceted-filter"
import {isNull} from "@/utils/Utils.ts";
import {Trash2} from "lucide-react";
import {cn} from "@/utils/shadcnUtils.ts";
import DataTableSortOptions from "@/components/data-table/data-table-sort-options.tsx";
import DataTableFacetedSort from "@/components/data-table/data-table-faceted-sort.tsx";
import DataTableFilterOptions, {
  DataTableToolbarFilterOptions
} from "@/components/data-table/data-table-filter-options.tsx";
import DataTablePlusOptions, {DataTablePlusItemOptions} from "@/components/data-table/data-table-plus-options.tsx";

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  searchColumnId?: string

  /**
   * 过滤器选项
   */
  filterOptions?: DataTableToolbarFilterOptions[]

  /**
   * 新增条目
   */
  plusOptions?: DataTablePlusItemOptions<TData>[]
}

export function DataTableToolbar<TData>(props: DataTableToolbarProps<TData>) {
  const {
    table,
    searchColumnId,
    filterOptions = [],
    plusOptions = []
  } = props;

  const columnFilters = table.getState().columnFilters;
  const isFiltered = columnFilters.length > 0

  const sorting = table.getState().sorting;
  const isSorting = sorting.length > 0;

  const selectRows = table.getFilteredSelectedRowModel().rows.length;

  return (
    <div className={"flex flex-col space-y-2"}>
      <div
        className={"flex items-center justify-between rounded-md transition-colors border-transparent bg-secondary text-secondary-foreground py-2 px-3"}>

        <div className={"flex items-center space-x-4"}>
          <DataTablePlusOptions table={table} items={plusOptions}/>
          <DataTableFilterOptions table={table} filters={filterOptions}/>
          <DataTableSortOptions table={table}/>
          <DataTableViewOptions table={table}/>
          <span className={"text-sm transition-colors opacity-50"}>|</span>
          <span className={"text-sm transition-colors opacity-80"}>
                    已选择 {selectRows} 个
                </span>
          <Trash2 className={cn("cursor-pointer h-5 w-5",
            {
              "opacity-50": selectRows === 0
            })}/>
        </div>

        <div className={"flex items-center"}>
          {
            !isNull(searchColumnId) && (
              <Input placeholder="搜索..."
                     value={(table.getColumn(searchColumnId!!)?.getFilterValue() as string) ?? ""}
                     onChange={(event) =>
                       table.getColumn(searchColumnId!!)?.setFilterValue(event.target.value)
                     }
                     className="h-8 w-[150px] lg:w-[250px]"
              />
            )
          }
        </div>
      </div>
      <div className="flex flex-1 items-center space-x-2">
        {
          columnFilters.map(it => {
            const option = filterOptions.find(option => it.id === option.columnId);
            return !isNull(option) && (
              // TODO 未调整
              <DataTableFacetedFilter key={it.id}
                                      column={table.getColumn(option!!.columnId)}
                                      label={option!!.label}
                                      options={option!!.options}
              />
            )
          })
        }

        {
          sorting.map(it => {
            const column = table.getColumn(it.id);
            return !isNull(column) && (
              <DataTableFacetedSort key={it.id} column={column!!}/>
            )
          })
        }

        {(isFiltered || isSorting) && (
          <Button
            variant="secondary"
            onClick={() => {
              table.resetColumnFilters();
              table.resetSorting();
            }}
            className="h-6 rounded-md px-2 lg:px-3 text-xs"
          >
            重置条件
            <Cross2Icon className="ml-2 h-4 w-4"/>
          </Button>
        )}
      </div>
    </div>
  )
}

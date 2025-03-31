import {Cross2Icon} from "@radix-ui/react-icons"
import {Row, Table} from "@tanstack/react-table"
import {Button} from "@/components/ui/button.tsx"
import {Input} from "@/components/ui/input.tsx"
import {DataTableViewOptions} from "./data-table-view-options.tsx"
import {DataTableFacetedFilter} from "./data-table-faceted-filter.tsx"
import {cn, isNull} from "@/lib/utils.ts";
import {Trash2} from "lucide-react";
import DataTableSortOptions from "@/components/custom-ui/data-table/data-table-sort-options.tsx";
import DataTableFacetedSort from "@/components/custom-ui/data-table/data-table-faceted-sort.tsx";
import DataTableFilterOptions from "@/components/custom-ui/data-table/data-table-filter-options.tsx";
import DataTablePlusOptions, {
  DataTablePlusItemOptions
} from "@/components/custom-ui/data-table/data-table-plus-options.tsx";
import {checkboxSelectId} from "@/components/custom-ui/data-table/data-table-column.tsx";
import {useMemo} from "react";
import {DataTableFilter} from "@/components/custom-ui/data-table/types.ts";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  enableSearch?: boolean

  keyword?: string | undefined
  onKeywordChange?: (keywords: string | undefined) => void

  /**
   * 过滤器选项
   */
  filterOptions?: DataTableFilter[]

  /**
   * 新增条目
   */
  plusOptions?: DataTablePlusItemOptions<TData>[]

  /**
   * 触发删除
   * @param rows
   */
  onDelete?: (rows: Row<TData>[]) => Promise<void>

}

export function DataTableToolbar<TData>(props: DataTableToolbarProps<TData>) {
  const {
    table,
    enableSearch = true,
    keyword,
    onKeywordChange,
    filterOptions = [],
    plusOptions = [],
    onDelete
  } = props;

  const tableState = table.getState();
  const columnFilters = tableState.columnFilters;
  const isFiltered = columnFilters.length > 0

  const sorting = tableState.sorting;
  const isSorting = sorting.length > 0;

  const selectRows = table.getFilteredSelectedRowModel().rows;

  // 是否开启选择
  const checkboxSelectColumn = useMemo(() =>
    table.getAllColumns().find(it => it.id === checkboxSelectId), [table, checkboxSelectId])

  return (
    <div className={"flex flex-col space-y-2"}>
      <div
        className={"flex items-center justify-between rounded-md transition-colors border-transparent bg-accent text-secondary-foreground py-2 px-3 h-12"}>

        <div className={"flex items-center space-x-4"}>
          <DataTablePlusOptions table={table} items={plusOptions}/>
          <DataTableFilterOptions table={table} filters={filterOptions}/>
          <DataTableSortOptions table={table}/>
          <DataTableViewOptions table={table}/>
          {
            !!checkboxSelectColumn && (
              <>
                <span className={"text-sm text-foreground opacity-50"}>|</span>
                <span className={"text-sm text-foreground opacity-80"}>
                    已选择 {selectRows.length} 行
                </span>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant={"unstyled"}
                      className={cn("p-0 cursor-pointer disabled:cursor-no-drop")}
                      disabled={selectRows.length === 0}
                    >
                      <Trash2 className={cn("size-5")}/>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>确认删除?</AlertDialogTitle>
                      <AlertDialogDescription>
                        确认删除 {selectRows.length} 行记录？
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>取消</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => {
                          onDelete?.(selectRows);
                          // 清空选中状态
                          table.resetRowSelection(true);
                        }}
                      >
                        确认
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </>
            )
          }
        </div>

        <div className={"flex items-center"}>
          {
            enableSearch && (
              <Input placeholder="搜索..."
                     value={keyword || ""}
                     onChange={(event) => onKeywordChange?.(event.target.value)}
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
            const column = option ? table.getColumn(option.columnId) : undefined;
            return (option && column) && (
              <DataTableFacetedFilter
                key={it.id}
                column={column}
                label={option.label}
                filter={option}
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

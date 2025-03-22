import {CSSProperties, HTMLProps, useState} from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  ColumnPinningState,
  flexRender,
  getCoreRowModel,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  OnChangeFn,
  PaginationState,
  Row,
  SortingState,
  useReactTable,
  VisibilityState
} from "@tanstack/react-table"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table.tsx"
import {DataTablePagination} from "./data-table-pagination.tsx"
import {DataTableToolbar} from "./data-table-toolbar.tsx"
import {cn, isBlank, isEmpty, isNull} from "@/lib/utils.ts";
import {checkboxSelectId} from "@/components/custom-ui/data-table/data-table-column.tsx";
import {DataTablePlusItemOptions} from "@/components/custom-ui/data-table/data-table-plus-options.tsx";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import {useDebounceFn, useDeepCompareEffect, useThrottleEffect} from "ahooks";
import {DataTableFilter} from "@/components/custom-ui/data-table/types.ts";
import {useControllableState} from "@/components/hooks/use-controllable-state.ts";

import styles from "./styles.module.less"

export type DataTableProps<TData, TValue> = Omit<HTMLProps<HTMLDivElement>, "data" | "onChange"> & {

  /**
   * 数据
   */
  data: TData[]

  /**
   * 数据总长度，如果为空则自动计算
   */
  rowCount?: number

  /**
   * 加载状态
   */
  loading?: boolean

  /**
   * 列描述
   */
  columns: ColumnDef<TData, TValue>[]

  /**
   * 过滤器选项
   */
  filterOptions?: DataTableFilter[]

  /**
   * 新增条目
   */
  plusOptions?: DataTablePlusItemOptions<TData>[]

  /**
   * 默认排序
   */
  defaultSorting?: SortingState

  /**
   * 是否开启搜索
   */
  enableSearch?: boolean

  /**
   * 自动搜索时的列id，并且满足 manual === true && onChange 则使用自动搜索
   */
  searchColumnId?: string

  /**
   * 是否手动进行 筛选/过滤/分页
   */
  manual?: boolean

  /**
   * 列冻结
   */
  columnPinning?: ColumnPinningState

  /**
   * 分页配置
   */
  pagination?: PaginationState

  /**
   * 分页配置
   * @param pagination
   */
  onPaginationChange?: OnChangeFn<PaginationState>

  /**
   * 变更事件
   * @param filter 过滤
   * @param sort 排序
   * @param keyword 关键字
   */
  onChange?: (
    filter: ColumnFiltersState,
    sort: SortingState,
    keyword?: string | undefined,
  ) => void

  /**
   * 默认的列过滤状态
   */
  defaultColumnFiltersState?: ColumnFiltersState | undefined

  /**
   * 触发删除
   * @param rows
   */
  onDelete?: (rows: Row<TData>[]) => Promise<void>

}

/**
 * 数据表
 * @constructor
 */
export function DataTable<TData, TValue>(props: DataTableProps<TData, TValue>) {
  const {
    data,
    rowCount,
    columns,
    enableSearch,
    searchColumnId,
    filterOptions = [],
    plusOptions = [],
    loading = false,
    manual = false,
    pagination,
    defaultSorting,
    onPaginationChange,
    onChange,
    className,
    defaultColumnFiltersState = [],
    onDelete,
    ...rest
  } = props

  const [rowSelection, setRowSelection] = useState({})
  const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>(() => ([...defaultColumnFiltersState]))
  const [columnPinning, setColumnPinning] = useState<ColumnPinningState>(props.columnPinning || {})
  const [sorting, setSorting] = useState<SortingState>(() => defaultSorting || [])
  const [keyword, setKeyword] = useState<string>();

  const [paginationState, onPaginationStateChange] = useControllableState<PaginationState>({
    prop: pagination,
    defaultProp: {pageIndex: 0, pageSize: 10},
    onChange: onPaginationChange
  });

  // 防抖
  const {run: onChangeDebounce} = useDebounceFn(() => {
    if (!isNull(onChange)) {
      onChange?.(columnFilters, sorting, keyword)
    }
  }, {wait: 300});

  // 变更事件
  useDeepCompareEffect(onChangeDebounce, [columnFilters, sorting, keyword]);

  const isSupportSelect = !isNull(columns.find(it => it.id === checkboxSelectId))

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnVisibility,
      rowSelection,
      columnFilters,
      pagination: paginationState,
      columnPinning
    },
    enableColumnResizing: true,
    columnResizeMode: 'onChange',
    rowCount: rowCount,
    enableRowSelection: isSupportSelect,
    onRowSelectionChange: setRowSelection,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnVisibilityChange: setColumnVisibility,
    onPaginationChange: onPaginationStateChange,
    onColumnPinningChange: setColumnPinning,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getFacetedRowModel: getFacetedRowModel(),
    getFacetedUniqueValues: getFacetedUniqueValues(),
    getFilteredRowModel: getFilteredRowModel(),
    getSortedRowModel: getSortedRowModel(),
    manualFiltering: onChange ? true : manual,
    manualPagination: onPaginationChange ? true : manual,
    manualSorting: onChange ? true : manual,
    enableColumnPinning: true
  })

  // 如果是自动则过滤搜索
  useThrottleEffect(
    () => {
      if (!(onChange ? true : manual) && !isBlank(searchColumnId)) {
        if (isBlank(keyword)) {
          table.getColumn(searchColumnId!)?.setFilterValue(undefined)
        } else {
          table.getColumn(searchColumnId!)?.setFilterValue(keyword)
        }
      }
    },
    [keyword],
    {
      wait: 500,
    });

  return (
    <div
      {...rest}
      className={cn("flex flex-col gap-4 size-full overflow-hidden", className)}
    >
      <DataTableToolbar
        table={table}
        enableSearch={enableSearch}
        keyword={keyword}
        onKeywordChange={setKeyword}
        filterOptions={filterOptions}
        plusOptions={plusOptions}
        onDelete={onDelete}
      />
      <Table className={"flex-auto rounded-md border"}>
        <TableHeader className={"sticky top-0 bg-background z-10"}>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                const column = header.column;
                const pinned = column.getIsPinned();

                const pinnedStyle: CSSProperties = {}
                if (pinned === "left") {
                  pinnedStyle.left = column.getStart(pinned)
                } else if (pinned === "right") {
                  pinnedStyle.right = column.getAfter(pinned)
                }

                return (
                  <TableHead key={header.id}
                             colSpan={header.colSpan}
                             style={{
                               ...pinnedStyle
                             }}
                             className={cn("relative bg-background z-0 p-0 w-auto",
                               {
                                 "sticky z-10": pinned !== false,
                                 "-translate-x-[1px]": pinned === "left",
                                 "translate-x-[1px]": pinned === "right"
                               })
                             }
                  >
                    <div className={"truncate px-4"}
                         style={{width: column.getSize() - 5}}
                    >
                      {
                        header.isPlaceholder
                          ? null
                          : flexRender(
                            column.columnDef.header,
                            header.getContext()
                          )
                      }
                    </div>
                    {column.getCanResize() && (
                      <div onMouseDown={header.getResizeHandler()}
                           onTouchStart={header.getResizeHandler()}
                           className={cn(styles.resizer, column.getIsResizing() ? 'isResizing' : '')}
                      />
                    )}
                  </TableHead>
                )
              })}
            </TableRow>
          ))
          }
        </TableHeader>
        <TableBody className={"sticky z-0"}>
          {/* 加载状态 */}
          {loading && (
            <TableRow>
              <TableCell
                colSpan={columns.length}
                className="h-24 text-center"
              >
                <Spinner/>
              </TableCell>
            </TableRow>
          )}

          {!loading && (
            !isEmpty(table.getRowModel().rows)
              ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id}
                            data-state={row.getIsSelected() && "selected"}
                  >
                    {row.getVisibleCells().map((cell) => {
                      const column = cell.column;
                      const pinned = column.getIsPinned();
                      const pinnedStyle: CSSProperties = {}
                      if (pinned === "left") {
                        pinnedStyle.left = column.getStart(pinned)
                      } else if (pinned === "right") {
                        pinnedStyle.right = column.getAfter(pinned)
                      }

                      return (
                        <TableCell key={cell.id}
                                   style={{
                                     ...pinnedStyle
                                   }}
                                   className={cn("relative bg-background z-0 p-0 w-auto",
                                     {
                                       "sticky z-10": pinned !== false,
                                       "-translate-x-[1px]": pinned === "left",
                                       "translate-x-[1px]": pinned === "right"
                                     })
                                   }
                        >
                          <div className={cn("truncate p-4", {"pl-4": column.getCanSort()})}
                               style={{width: column.getSize()}}
                          >
                            {flexRender(
                              column.columnDef.cell,
                              cell.getContext()
                            )}
                          </div>

                        </TableCell>
                      )
                    })}
                  </TableRow>
                ))
              )
              : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    暂无数据
                  </TableCell>
                </TableRow>
              )
          )}
        </TableBody>
      </Table>
      <DataTablePagination table={table}/>
    </div>
  )
}

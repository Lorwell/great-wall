import {useEffect, useState} from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    flexRender,
    getCoreRowModel,
    getFacetedRowModel,
    getFacetedUniqueValues,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    PaginationState,
    SortingState,
    useReactTable,
    VisibilityState,
} from "@tanstack/react-table"
import {Table, TableBody, TableCell, TableHead, TableHeader, TableRow,} from "@/components/ui/table"
import {DataTablePagination} from "./data-table-pagination"
import {DataTableToolbar, DataTableToolbarFilterOptions} from "./data-table-toolbar"
import {isNull} from "@/utils/Utils.ts";
import {checkboxSelectId} from "@/components/data-table/data-table-column.tsx";

import styles from "./styles.module.less"
import {cn} from "@/utils/shadcnUtils.ts";

interface DataTableProps<TData, TValue> {

    /**
     * 数据
     */
    data: TData[]

    /**
     * 数据总长度，如果为空则自动计算
     */
    rowCount?: number

    /**
     * 列描述
     */
    columns: ColumnDef<TData, TValue>[]

    /**
     * 过滤器选项
     */
    toolbarFilterOptions?: DataTableToolbarFilterOptions[]

    /**
     * 搜索列的id
     */
    searchColumnId?: string

    /**
     * 是否手动进行 筛选/过滤/分页
     */
    manual?: boolean

    /**
     * 变更事件
     * @param filter 过滤
     * @param sort 排序
     * @param page 分页
     */
    onChange?: (
        filter: ColumnFiltersState,
        sort: SortingState,
        page: PaginationState
    ) => void

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
        searchColumnId,
        toolbarFilterOptions = [],
        manual = false,
        onChange
    } = props

    const [rowSelection, setRowSelection] = useState({})
    const [columnVisibility, setColumnVisibility] = useState<VisibilityState>({})
    const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])
    const [sorting, setSorting] = useState<SortingState>([])
    const [pagination, setPagination] = useState<PaginationState>({
        pageIndex: 0,
        pageSize: 10
    })

    // 变更事件
    useEffect(() => {
        if (!isNull(onChange)) {
            onChange?.(columnFilters, sorting, pagination)
        }
    }, [columnFilters, sorting, pagination]);

    const isSupportSelect = !isNull(columns.find(it => it.id === checkboxSelectId))

    const table = useReactTable({
        data,
        columns,
        state: {
            sorting,
            columnVisibility,
            rowSelection,
            columnFilters,
            pagination,
        },
        enableColumnResizing: true,
        columnResizeMode: 'onChange',
        rowCount: rowCount,
        enableRowSelection: isSupportSelect,
        onRowSelectionChange: setRowSelection,
        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onColumnVisibilityChange: setColumnVisibility,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFacetedRowModel: getFacetedRowModel(),
        getFacetedUniqueValues: getFacetedUniqueValues(),
        manualFiltering: manual,
        manualPagination: manual,
        manualSorting: manual
    })

    return (
        <div className="space-y-4">
            <DataTableToolbar table={table} searchColumnId={searchColumnId} filter={toolbarFilterOptions}/>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}
                                                   colSpan={header.colSpan}
                                                   style={{position: 'relative', width: header.getSize()}}
                                        >
                                            <div className={"truncate"}
                                                 style={{width: header.getSize() - 5}}
                                            >
                                                {
                                                    header.isPlaceholder
                                                        ? null
                                                        : flexRender(
                                                            header.column.columnDef.header,
                                                            header.getContext()
                                                        )
                                                }
                                            </div>
                                            {header.column.getCanResize() && (
                                                <div onMouseDown={header.getResizeHandler()}
                                                     onTouchStart={header.getResizeHandler()}
                                                     className={cn(styles.resizer, header.column.getIsResizing() ? 'isResizing' : '')}
                                                />
                                            )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))
                        }
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length
                            ? (
                                table.getRowModel().rows.map((row) => (
                                    <TableRow key={row.id}
                                              data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}
                                                       style={{width: cell.column.getSize()}}
                                            >
                                                <div className={cn("truncate", {
                                                    "px-3": cell.column.getCanSort()
                                                })}
                                                     style={{width: cell.column.getSize()}}
                                                >
                                                    {flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )}
                                                </div>

                                            </TableCell>
                                        ))}
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
                            )}
                    </TableBody>
                </Table>
            </div>
            <DataTablePagination table={table} isSupportSelect={isSupportSelect}/>
        </div>
    )
}

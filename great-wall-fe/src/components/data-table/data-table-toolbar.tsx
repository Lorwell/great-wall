import {Cross2Icon} from "@radix-ui/react-icons"
import {Table} from "@tanstack/react-table"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {DataTableViewOptions} from "./data-table-view-options"
import {DataTableFacetedFilter, DataTableFacetedFilterOptions} from "./data-table-faceted-filter"
import {isNull} from "@/utils/Utils.ts";


export interface DataTableToolbarFilterOptions {
    columnId: string
    label: string
    options: DataTableFacetedFilterOptions[]
}

interface DataTableToolbarProps<TData> {
    table: Table<TData>
    searchColumnId?: string
    filter: DataTableToolbarFilterOptions[]
}

/**
 * 数据表工具栏
 * @param table
 * @param searchColumnId
 * @param filter
 * @constructor
 */
export function DataTableToolbar<TData>({table, searchColumnId, filter}: DataTableToolbarProps<TData>) {
    const isFiltered = table.getState().columnFilters.length > 0

    return (
        <div className="flex items-center justify-between">
            <div className="flex flex-1 items-center space-x-2">
                {
                    !isNull(searchColumnId) && (
                        <Input
                            placeholder="搜索..."
                            value={(table.getColumn(searchColumnId!!)?.getFilterValue() as string) ?? ""}
                            onChange={(event) =>
                                table.getColumn(searchColumnId!!)?.setFilterValue(event.target.value)
                            }
                            className="h-8 w-[150px] lg:w-[250px]"
                        />
                    )
                }

                {
                    filter.map((option) => (
                        table.getColumn(option.columnId) && (
                            <DataTableFacetedFilter
                                column={table.getColumn(option.columnId)}
                                label={option.label}
                                options={option.options}
                            />
                        )
                    ))
                }

                {isFiltered && (
                    <Button
                        variant="ghost"
                        onClick={() => table.resetColumnFilters()}
                        className="h-8 px-2 lg:px-3"
                    >
                        重置过滤条件
                        <Cross2Icon className="ml-2 h-4 w-4"/>
                    </Button>
                )}
            </div>
            <DataTableViewOptions table={table}/>
        </div>
    )
}

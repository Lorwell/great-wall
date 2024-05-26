import {Column, RowData} from "@tanstack/react-table";
import {ArrowDownIcon, ArrowUpIcon, CaretSortIcon, Cross2Icon} from "@radix-ui/react-icons";
import {Button} from "@/components/ui/button.tsx";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";

export interface DataTableFacetedSortProps<TData extends RowData> {
    column: Column<TData>;
}

/**
 * 数据表分面排序
 * @param props
 * @constructor
 */
const DataTableFacetedSort = <TData extends RowData>(props: DataTableFacetedSortProps<TData>) => {
    const {column} = props

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="secondary"
                        className="h-6 rounded-md px-2 lg:px-3 text-xs"
                >
                    {column.getIsSorted() === "desc" ? (
                        <ArrowDownIcon className="h-4 w-4"/>
                    ) : column.getIsSorted() === "asc" ? (
                        <ArrowUpIcon className="h-4 w-4"/>
                    ) : (
                        <CaretSortIcon className="h-4 w-4"/>
                    )}

                    {/*@ts-ignore*/}
                    {column.columnDef.meta?.["label"] || column.id}

                    <Cross2Icon className="ml-2 h-4 w-4"
                                onClick={(event) => {
                                    event.stopPropagation()
                                    column.clearSorting()
                                }}
                    />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
                <DropdownMenuItem onClick={() => column.toggleSorting(false)}>
                    <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"/>
                    正序
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => column.toggleSorting(true)}>
                    <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"/>
                    倒叙
                </DropdownMenuItem>
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => column.clearSorting()}>
                    <Cross2Icon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"/>
                    关闭
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DataTableFacetedSort
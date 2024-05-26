import {Table} from "@tanstack/react-table";
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
import {DataTableFacetedFilterOptions} from "@/components/data-table/data-table-faceted-filter.tsx";
import {isNull} from "@/utils/Utils.ts";
import {cn} from "@/utils/shadcnUtils.ts";

export interface DataTableToolbarFilterOptions {
    columnId: string
    label?: string
    options: DataTableFacetedFilterOptions[]
}

interface DataTableFilterOptionsProps<TData> {
    table: Table<TData>
    filters: DataTableToolbarFilterOptions[]
}

/**
 * 过滤属性
 * @param props
 * @constructor
 */
function DataTableFilterOptions<TData>(props: DataTableFilterOptionsProps<TData>) {
    const {table, filters} = props;
    const disabled = filters.length === 0;

    return (
        <DropdownMenu>
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

                {
                    filters.map(filter => {
                        const column = table.getColumn(filter.columnId);

                        return !isNull(column) && (
                            <DropdownMenuSub key={filter.columnId}>
                                <DropdownMenuSubTrigger>
                                    {/*@ts-ignore*/}
                                    {option.label || column.columnDef.meta?.["label"] || column.id}
                                </DropdownMenuSubTrigger>
                                <DropdownMenuSubContent>
                                    {/*@ts-ignore*/}
                                    <DropdownMenuRadioGroup value={column!!.getFilterValue()}>
                                        {
                                            filter.options.map(option => (
                                                <DropdownMenuRadioItem value={option.value}
                                                                       onClick={() => column!!.setFilterValue(option.value)}
                                                >
                                                    {
                                                        !isNull(option.icon) && (
                                                            // @ts-ignore
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
                    })
                }

                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => table.resetColumnFilters()}>
                    取消过滤条件
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DataTableFilterOptions
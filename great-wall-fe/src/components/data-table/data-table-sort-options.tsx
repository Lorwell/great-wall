import {DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {
    DropdownMenu,
    DropdownMenuContent, DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuSub,
    DropdownMenuSubContent,
    DropdownMenuSubTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {ArrowUpDown} from "lucide-react";
import {Table} from "@tanstack/react-table";
import {ArrowDownIcon, ArrowUpIcon} from "@radix-ui/react-icons";
import {cn} from "@/utils/shadcnUtils.ts";

interface DataTableSortOptionsProps<TData> {
    table: Table<TData>
}

/**
 * 排序属性
 * @param table
 * @constructor
 */
function DataTableSortOptions<TData>({table}: DataTableSortOptionsProps<TData>) {
    const supportSortColumns = table.getAllColumns().filter((column) => column.getCanSort());
    const disabled = supportSortColumns.length === 0;

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={disabled}>
                <ArrowUpDown className={cn("cursor-pointer h-5 w-5",
                    {
                        "opacity-50": disabled
                    })}
                />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[150px]">
                <DropdownMenuLabel>排序</DropdownMenuLabel>
                <DropdownMenuSeparator/>
                {supportSortColumns.map((column) => {
                    const isSorted = column.getIsSorted();
                    const sortDirection = typeof isSorted !== "boolean" ? isSorted : ""
                    return (
                        <DropdownMenuSub key={column.id}>
                            <DropdownMenuSubTrigger>
                                {/*@ts-ignore*/}
                                {column.columnDef.meta?.["label"] || column.id}
                            </DropdownMenuSubTrigger>
                            <DropdownMenuSubContent>
                                <DropdownMenuRadioGroup value={sortDirection}>
                                    <DropdownMenuRadioItem value={"asc"}
                                                           onClick={() => column.toggleSorting(false)}
                                    >
                                        <ArrowUpIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"/>
                                        正序
                                    </DropdownMenuRadioItem>
                                    <DropdownMenuRadioItem value={"desc"}
                                                           onClick={() => column.toggleSorting(true)}
                                    >
                                        <ArrowDownIcon className="mr-2 h-3.5 w-3.5 text-muted-foreground/70"/>
                                        倒叙
                                    </DropdownMenuRadioItem>
                                </DropdownMenuRadioGroup>
                            </DropdownMenuSubContent>
                        </DropdownMenuSub>
                    )
                })}
                <DropdownMenuSeparator/>
                <DropdownMenuItem onClick={() => table.resetSorting()}>
                    取消排序
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}

export default DataTableSortOptions
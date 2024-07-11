import {Table} from "@tanstack/react-table";
import {DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {Plus} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu.tsx";
import {IconType} from "@/components/types.tsx";
import {ReactElement, ReactNode} from "react";
import {isNull} from "@/utils/Utils.ts";
import {cn} from "@/utils/shadcnUtils.ts";

export interface DataTablePlusItemOptions<TData> {
  label: string | ReactNode | ReactElement;
  icon?: IconType
  onClick?: (table: Table<TData>) => void
}

export interface DataTablePlusOptionsProps<TData> {
  table: Table<TData>
  items: DataTablePlusItemOptions<TData>[]
}

/**
 * 数据表新增数据选项
 * @param props
 * @constructor
 */
function DataTablePlusOptions<TData>(props: DataTablePlusOptionsProps<TData>) {
  const {table, items} = props;
  const disabled = items.length === 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild disabled={disabled}>
        <Plus className={cn("cursor-pointer h-6 w-6",
          {
            "opacity-50": disabled
          }
        )}/>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[150px]">
        <DropdownMenuLabel>新增</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        {
          items.map((item, index) => (
            <DropdownMenuItem key={index}
                              onClick={() => item.onClick?.(table)}
            >
              {
                !isNull(item.icon) && (
                  // @ts-ignore
                  <item.icon className="mr-2 h-4 w-4"/>
                )
              }

              {item.label}
            </DropdownMenuItem>
          ))
        }
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default DataTablePlusOptions
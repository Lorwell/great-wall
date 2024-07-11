import {DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu"
import {MixerHorizontalIcon} from "@radix-ui/react-icons"
import {Table} from "@tanstack/react-table"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"
import {isNull} from "@/utils/Utils.ts";

interface DataTableViewOptionsProps<TData> {
  table: Table<TData>
}

/**
 * 数据表视图选项
 *
 * @param table
 * @constructor
 */
export function DataTableViewOptions<TData>({
                                              table,
                                            }: DataTableViewOptionsProps<TData>) {

  const allSelect = isNull(table.getAllColumns().find(c => !c.getIsVisible()));

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <MixerHorizontalIcon className="cursor-pointer h-5 w-5"/>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[150px]">
        <DropdownMenuLabel>显示/隐藏</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        {table.getAllColumns()
          .filter(
            (column) =>
              typeof column.accessorFn !== "undefined" && column.getCanHide()
          )
          .map((column) => {
            return (
              <DropdownMenuCheckboxItem
                key={column.id}
                className="capitalize"
                checked={column.getIsVisible()}
                onCheckedChange={(value) => column.toggleVisibility(value)}
              >
                {/*@ts-ignore*/}
                {column.columnDef.meta?.["label"] || column.id}
              </DropdownMenuCheckboxItem>
            )
          })}
        <DropdownMenuSeparator/>
        <DropdownMenuCheckboxItem
          key={"_all"}
          className="capitalize"
          checked={allSelect}
          onCheckedChange={(value) => {
            table.getAllColumns().forEach(c => c.toggleVisibility(value))
          }}
        >
          {allSelect && "取消"}全选
        </DropdownMenuCheckboxItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

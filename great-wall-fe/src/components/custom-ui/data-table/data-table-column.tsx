import {ColumnDef, RowData} from "@tanstack/react-table";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {DataTableColumnHeader} from "@/components/custom-ui/data-table/data-table-column-header.tsx";
import {cn} from "@/lib/utils.ts";

/**
 * 内置的选择列的id
 */
export const checkboxSelectId = "_checkbox_select"

/**
 * 数据表复选框列
 *
 * 用于表格中选择行
 */
export const dataTableCheckboxColumn = <TData extends RowData>(): ColumnDef<TData> => (
  {
    id: checkboxSelectId,
    header: ({table}) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="选择所有"
        className="translate-y-[2px]"
      />
    ),
    cell: ({row}) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="选择行"
        className="translate-y-[2px]"
      />
    ),
    size: 55,
    maxSize: 55,
    enableSorting: false,
    enableHiding: false,
    enableResizing: false
  }
)

export interface ColumnCellDef<TData extends RowData, TValue = any> extends Omit<ColumnDef<TData, TValue>, "accessorKey" | "label" | "header"> {

  /**
   * 列id
   */
  columnId: string,

  /**
   * 列名称
   */
  label: string,
}

/**
 * 列单元格
 * @param cellDef 单元格定义
 */
export const columnCell = <TData extends RowData>(
  cellDef: ColumnCellDef<TData>
): ColumnDef<TData> => {
  const {columnId, label, meta, cell, ...rest} = cellDef;

  return {
    ...rest,
    accessorKey: columnId,
    meta: {
      ...meta,
      label: label,
    },
    header: ({column}) => (
      <DataTableColumnHeader column={column} label={label}/>
    ),
    cell: (ctx) => {

      const cellValue = typeof cell === "string" ? cell : cell?.(ctx);

      // if (typeof cellValue === "string") {
      //   return (
      //     <div className={cn("w-full truncate", {"pl-3": ctx.column.getCanSort()})}>
      //       {cellValue}
      //     </div>
      //   )
      // }

      return (
        <div className={cn("w-full truncate", {"pl-3": ctx.column.getCanSort()})}>
          {cellValue}
        </div>
      )
    }
  }
}

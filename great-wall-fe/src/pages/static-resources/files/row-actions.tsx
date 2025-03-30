import {Cell, Column, Row, Table} from "@tanstack/react-table";
import {FileX} from "lucide-react";
import {
  DataTableRowActions,
  DataTableRowActionsOptions
} from "@/components/custom-ui/data-table/data-table-row-actions.tsx";
import {FileOutput} from "@/constant/api/static-resources/schema";

export interface RowContext {
  cell: Cell<FileOutput, any>
  column: Column<FileOutput>
  row: Row<FileOutput>
  table: Table<FileOutput>
}

export interface RowActionsEvent {

  /**
   * 删除事件
   * @param ctx
   */
  onDelete?: (ctx: RowContext) => void

}

export interface RowActionsProps extends RowContext, RowActionsEvent {

}

/**
 * 行操作
 * @param props
 * @constructor
 */
const RowActions = (props: RowActionsProps) => {
  const {
    row,
    column,
    cell,
    table,
    onDelete,
  } = props;

  const ctx: RowContext = {row, column, cell, table}

  const options: DataTableRowActionsOptions<FileOutput>[] = [
    {
      key: "delete",
      label: "删除",
      icon: FileX,
      onClick: () => onDelete?.(ctx)
    },
  ]

  return (
    <DataTableRowActions row={row} options={options}/>
  )
}

export default RowActions
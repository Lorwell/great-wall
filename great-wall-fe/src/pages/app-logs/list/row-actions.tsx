import {Cell, Column, Row, Table} from "@tanstack/react-table";
import {FileDown, Rows4} from "lucide-react";
import {DataTableRowActions, DataTableRowActionsOptions} from "@/components/data-table/data-table-row-actions.tsx";
import {LogListOutput} from "@/constant/api/app-logs/types.ts";

export interface RowContext {
  cell: Cell<LogListOutput, any>
  column: Column<LogListOutput>
  row: Row<LogListOutput>
  table: Table<LogListOutput>
}

export interface RowActionsEvent {

  /**
   * 查看事件
   * @param ctx
   */
  onView?: (ctx: RowContext) => void

  /**
   * 下载事件
   * @param ctx
   */
  onDownload?: (ctx: RowContext) => void

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
    onView,
    onDownload
  } = props;

  const ctx: RowContext = {row, column, cell, table}

  const options: DataTableRowActionsOptions<LogListOutput>[] = [
    {
      key: "view",
      label: "查看",
      icon: Rows4,
      onClick: () => onView?.(ctx)
    },
    {
      key: "download",
      label: "下载",
      icon: FileDown,
      onClick: () => onDownload?.(ctx)
    }
  ]

  return (
    <DataTableRowActions row={row} options={options}/>
  )
}

export default RowActions
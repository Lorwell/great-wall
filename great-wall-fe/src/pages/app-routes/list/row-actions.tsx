import {AppRoute} from "@/pages/app-routes/list/schema.ts";
import {Cell, Column, Row, Table} from "@tanstack/react-table";
import {Pencil, Rows4, ShieldBan} from "lucide-react";
import {DataTableRowActions, DataTableRowActionsOptions} from "@/components/data-table/data-table-row-actions.tsx";
import {AppRouteStatusEnum} from "@/constant/api/app-routes/types.ts";

export interface RowContext {
  cell: Cell<AppRoute, any>
  column: Column<AppRoute>
  row: Row<AppRoute>
  table: Table<AppRoute>
}

export interface RowActionsEvent {

  /**
   * 查看事件
   * @param ctx
   */
  onView?: (ctx: RowContext) => void

  /**
   * 编辑事件
   * @param ctx
   */
  onEdit?: (ctx: RowContext) => void

  /**
   * 查看事件
   * @param ctx
   */
  onOffline?: (ctx: RowContext) => void

  /**
   * 查看事件
   * @param ctx
   */
  onOnline?: (ctx: RowContext) => void

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
    onOnline,
    onOffline,
    onEdit
  } = props;

  const ctx: RowContext = {row, column, cell, table}
  const status = row.getValue<AppRouteStatusEnum>("status");

  const options: DataTableRowActionsOptions<AppRoute>[] = [
    {
      key: "view",
      label: "查看",
      icon: Rows4,
      onClick: () => onView?.(ctx)
    },
    {
      key: "edit",
      label: "编辑",
      icon: Pencil,
      onClick: () => onEdit?.(ctx)
    },
  ]

  if (AppRouteStatusEnum.ONLINE === status) {
    options.push({
      key: "offline",
      label: "下线",
      icon: ShieldBan,
      onClick: () => onOffline?.(ctx)
    })
  } else if (AppRouteStatusEnum.OFFLINE === status) {
    options.push({
      key: "online",
      label: "上线",
      icon: ShieldBan,
      onClick: () => onOnline?.(ctx)
    })
  }

  return (
    <DataTableRowActions row={row} options={options}/>
  )
}

export default RowActions
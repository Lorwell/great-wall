import {Cell, Column, Row, Table} from "@tanstack/react-table";
import {Files, Pencil} from "lucide-react";
import {
  DataTableRowActions,
  DataTableRowActionsOptions
} from "@/components/custom-ui/data-table/data-table-row-actions.tsx";
import {StaticResourcesOutput} from "@/constant/api/static-resources/schema";

export interface RowContext {
  cell: Cell<StaticResourcesOutput, any>
  column: Column<StaticResourcesOutput>
  row: Row<StaticResourcesOutput>
  table: Table<StaticResourcesOutput>
}

export interface RowActionsEvent {

  /**
   * 编辑事件
   * @param ctx
   */
  onEdit?: (ctx: RowContext) => void

  /**
   * 查看文件列表事件
   * @param ctx
   */
  onViewFiles?: (ctx: RowContext) => void

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
    onEdit,
    onViewFiles
  } = props;

  const ctx: RowContext = {row, column, cell, table}

  const options: DataTableRowActionsOptions<StaticResourcesOutput>[] = [
    {
      key: "edit",
      label: "编辑",
      icon: Pencil,
      onClick: () => onEdit?.(ctx)
    },
    {
      key: "viewFiles",
      label: "查看文件列表",
      icon: Files,
      onClick: () => onViewFiles?.(ctx)
    },
  ]

  return (
    <DataTableRowActions row={row} options={options}/>
  )
}

export default RowActions
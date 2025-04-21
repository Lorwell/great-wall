import {Cell, Column, Row, Table} from "@tanstack/react-table";
import {Download, FileX, FolderOpen} from "lucide-react";
import {
  DataTableRowActions,
  DataTableRowActionsOptions
} from "@/components/custom-ui/data-table/data-table-row-actions.tsx";
import {FileOutput, FileTypeEnum} from "@/constant/api/static-resources/schema";

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

  /**
   * 下载事件
   * @param ctx
   */
  onDownload?: (ctx: RowContext) => void

  /**
   * 打开文件夹
   * @param ctx
   */
  onOpenDir?: (ctx: RowContext) => void

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
    onOpenDir,
    onDownload
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

  const type = row.original.type;

  if (type === FileTypeEnum.DIR) {
    options.push(
      {
        key: "views",
        label: "打开文件夹",
        icon: FolderOpen,
        onClick: () => onOpenDir?.(ctx)
      }
    )
  } else {
    options.push(
      {
        key: "download",
        label: "下载文件",
        icon: Download,
        onClick: () => onDownload?.(ctx)
      }
    )
  }

  return (
    <DataTableRowActions row={row} options={options}/>
  )
}

export default RowActions
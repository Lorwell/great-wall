import {CellContext, ColumnDef} from "@tanstack/react-table";
import {columnCell, dataTableCheckboxColumn} from "@/components/custom-ui/data-table/data-table-column.tsx";
import {FileOutput, FileTypeEnum} from "@/constant/api/static-resources/schema.ts";
import {formatBytes} from "@/lib/utils.ts";
import dayjs from "dayjs";
import RowActions, {RowActionsEvent} from "./row-actions";
import {File, Folder} from 'lucide-react'
import {useNavigateFileDir} from "@/pages/static-resources/files/use-navigate-file-dir.ts";


export type ColumnsProps = {

  event: RowActionsEvent
}

/**
 * 数据表列配置
 * @param event
 */
export const columns = ({event}: ColumnsProps): ColumnDef<FileOutput>[] => {

  return [
    dataTableCheckboxColumn(),
    columnCell({
        columnId: "name",
        label: "名称",
        size: 250,
        enableSorting: false,
        cell: (ctx) => {
          return (
            <FileName ctx={ctx}/>
          )
        }
      }
    ),
    columnCell(
      {
        columnId: "size",
        label: "大小",
        size: 120,
        enableSorting: true,
        cell: ({getValue}) => {
          const value = getValue<number>()
          return formatBytes(value)
        }
      }
    ),
    columnCell(
      {
        columnId: "lastUpdateTime",
        label: "最后修改时间",
        size: 250,
        enableSorting: true,
        cell: ({getValue}) => {
          const value = getValue<number>()
          return dayjs(value).format("YYYY-MM-DD HH:mm:ss")
        }
      }
    ),
    {
      id: "_actions",
      size: 80,
      cell: ({cell, column, row, table}) => (
        <RowActions {...event}
                    row={row}
                    cell={cell}
                    column={column}
                    table={table}/>
      ),
    }
  ]
}

function FileName(
  {
    ctx
  }: { ctx: CellContext<FileOutput, string> }
) {
  const navigateFileDir = useNavigateFileDir();

  const {getValue, row} = ctx

  const value = getValue<string>()
  const type = row.original.type;
  switch (type) {
    case FileTypeEnum.FILE:
      return (
        <div className={"flex gap-2"}>
          <File className={"size-5 min-h-5 min-w-5"}/>
          <div className={"flex-auto truncate"}>
            {value}
          </div>
        </div>
      )
    case FileTypeEnum.DIR:
      return (
        <div
          className={"flex gap-2 cursor-pointer"}
          onClick={() => navigateFileDir(row.original.relativePath)}
        >
          <Folder className={"size-5 min-h-5 min-w-5"}/>
          <div className={"flex-auto truncate"}>
            {value}
          </div>
        </div>
      )
  }
}
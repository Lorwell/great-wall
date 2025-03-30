import {ColumnDef} from "@tanstack/react-table";
import {columnCell} from "@/components/custom-ui/data-table/data-table-column.tsx";
import dayjs from "dayjs";
import {LogListOutput, logTypeChinese, LogTypeEnum} from "@/constant/api/app-logs/types.ts";
import RowActions, {RowActionsEvent} from "@/pages/app-logs/list/row-actions.tsx";
import {byteSizeToUnitStr} from "@/lib/utils.ts";

export interface ColumnsProps {

  event: RowActionsEvent

}

/**
 * 数据表列配置
 * @param event
 */
export const columns = ({event}: ColumnsProps): ColumnDef<LogListOutput>[] => {
  return [
    columnCell(
      {
        columnId: "type",
        label: "类型",
        size: 120,
        enableSorting: false,
        cell: ({getValue}) => {
          const type = getValue() as LogTypeEnum
          return logTypeChinese(type)
        }
      }
    ),
    columnCell({
        columnId: "name",
        label: "名称",
        size: 250,
        enableSorting: false,
        cell: ({getValue}) => getValue()
      }
    ),
    columnCell(
      {
        columnId: "size",
        label: "大小",
        size: 120,
        cell: ({getValue}) => {
          const size = getValue() as number;
          return byteSizeToUnitStr(size, "0B")
        }
      }
    ),
    columnCell(
      {
        columnId: "lastUpdateTime",
        label: "最后修改时间",
        size: 200,
        cell: ({getValue}) => dayjs(getValue()).format("YYYY-MM-DD HH:mm:ss")
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
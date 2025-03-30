import {ColumnDef} from "@tanstack/react-table";
import {columnCell, dataTableCheckboxColumn} from "@/components/custom-ui/data-table/data-table-column.tsx";
import {StaticResourcesOutput} from "@/constant/api/static-resources/schema.ts";
import dayjs from "dayjs";
import RowActions, {RowActionsEvent} from "./row-actions";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.tsx";


export type ColumnsProps = {

  event: RowActionsEvent
}

/**
 * 数据表列配置
 * @param event
 */
export const columns = ({event}: ColumnsProps): ColumnDef<StaticResourcesOutput>[] => {

  return [
    dataTableCheckboxColumn(),
    columnCell({
        columnId: "name",
        label: "名称",
        size: 120,
        enableSorting: false,
        cell: ({getValue}) => {
          const value = getValue<string>()

          return (
            <HoverCard>
              <HoverCardTrigger>
                {value}
              </HoverCardTrigger>
              <HoverCardContent>
                <div className={"text-base font-bold mb-2"}>名称：</div>
                <div className={"text-sm"}>
                  {value || "暂无"}
                </div>
              </HoverCardContent>
            </HoverCard>
          )
        }
      }
    ),
    columnCell(
      {
        columnId: "describe",
        label: "描述",
        size: 250,
        enableSorting: false,
        cell: ({getValue}) => {
          const value = getValue<string>()
          return (
            <HoverCard>
              <HoverCardTrigger>
                {value}
              </HoverCardTrigger>
              <HoverCardContent>
                <div className={"text-base font-bold mb-2"}>描述：</div>
                <div className={"text-sm"}>
                  {value || "暂无"}
                </div>
              </HoverCardContent>
            </HoverCard>
          )
        }
      }
    ),
    columnCell(
      {
        columnId: "createTime",
        label: "创建时间",
        size: 200,
        cell: ({getValue}) => dayjs(getValue()).format("YYYY-MM-DD HH:mm:ss")
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
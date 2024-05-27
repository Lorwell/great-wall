import {ColumnDef} from "@tanstack/react-table";
import {AppRoute} from "@/pages/app-routes/list/schema.ts";
import {columnCell, dataTableCheckboxColumn} from "@/components/data-table/data-table-column.tsx";
import dayjs from "dayjs";
import {Badge} from "@/components/ui/badge";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.tsx";
import RowActions, {RowActionsEvent} from "@/pages/app-routes/list/row-actions.tsx";

export interface ColumnsProps {

  event: RowActionsEvent
}

/**
 * 数据表列配置
 * @param event
 */
export const columns = ({event}: ColumnsProps): ColumnDef<AppRoute>[] => {

  return [
    dataTableCheckboxColumn(),
    columnCell({
        columnId: "name",
        label: "名称",
        size: 120,
        enableSorting: false,
        cell: ({getValue}) => getValue()
      }
    ),
    columnCell(
      {
        columnId: "describe",
        label: "描述",
        size: 200,
        enableSorting: false,
        cell: ({getValue}) => getValue()
      }
    ),
    columnCell(
      {
        columnId: "uris",
        label: "路由地址",
        size: 200,
        enableSorting: false,
        cell: ({getValue}) => {
          const uris = getValue<Array<string>>();
          return (
            <div className={"w-full flex gap-1"}>
              <div className={"truncate"} style={{width: "calc(100% - 25px)"}}>
                {uris.join(", ")}
              </div>
              <HoverCard>
                <HoverCardTrigger>
                  <Badge variant={"secondary"} className={"cursor-pointer"}>{uris.length}</Badge>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className={"flex flex-col gap-1"}>
                    {uris.map((it, index) => (<span key={index}>{it}</span>))}
                  </div>
                </HoverCardContent>
              </HoverCard>
            </div>
          )
        }
      }
    ),
    columnCell(
      {
        columnId: "priority",
        label: "优先级",
        size: 100,
        cell: ({getValue}) => getValue()
      }
    ),
    columnCell(
      {
        columnId: "status",
        label: "状态",
        size: 80,
        cell: ({getValue}) => getValue()
      }
    ),
    columnCell(
      {
        columnId: "createTime",
        label: "创建时间",
        size: 120,
        cell: ({getValue}) => dayjs(getValue()).format("YYYY-MM-DD HH:mm:ss")
      }
    ),
    columnCell(
      {
        columnId: "lastUpdateTime",
        label: "最后修改时间",
        size: 120,
        cell: ({getValue}) => dayjs(getValue()).format("YYYY-MM-DD HH:mm:ss")
      }
    ),
    {
      id: "_actions",
      size: 50,
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
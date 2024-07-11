import {ColumnDef} from "@tanstack/react-table";
import {columnCell, dataTableCheckboxColumn} from "@/components/data-table/data-table-column.tsx";
import dayjs from "dayjs";
import {Badge} from "@/components/ui/badge";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.tsx";
import RowActions, {RowActionsEvent} from "@/pages/app-routes/list/row-actions.tsx";
import {AppRouteListOutput} from "@/constant/api/app-routes/types.ts";
import {TargetConfigSchemaValues} from "@/constant/api/app-routes/schema.ts";
import PredicatesColumn from "@/pages/app-routes/list/PredicatesColumn.tsx";

export interface ColumnsProps {

  event: RowActionsEvent
}

/**
 * 数据表列配置
 * @param event
 */
export const columns = ({event}: ColumnsProps): ColumnDef<AppRouteListOutput>[] => {

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
        columnId: "predicates",
        label: "路由条件",
        size: 80,
        enableSorting: false,
        cell: ({getValue}) => {
          const value = getValue()
          return (
            <PredicatesColumn predicates={value}/>
          )
        }
      }
    ),
    columnCell(
      {
        columnId: "targetConfig",
        label: "目标地址",
        size: 200,
        enableSorting: false,
        cell: ({getValue}) => {
          const {urls} = getValue<TargetConfigSchemaValues>();

          return (
            <div className={"w-full flex gap-1"}>
              <div className={"truncate"} style={{width: "calc(100% - 25px)"}}>
                {urls.map(it => it.url).join(", ")}
              </div>
              <HoverCard>
                <HoverCardTrigger>
                  <Badge variant={"secondary"} className={"cursor-pointer"}>{urls.length}</Badge>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className={"flex flex-col gap-1"}>
                    {urls.map((it, index) => (
                      <span key={index}>{it.url}{"  -  权重："}{it.weight}</span>
                    ))}
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
        cell: ({getValue}) => (
          <div className={"p-4"}>
            {getValue()}
          </div>
        )
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
        size: 150,
        cell: ({getValue}) => dayjs(getValue()).format("YYYY-MM-DD HH:mm:ss")
      }
    ),
    columnCell(
      {
        columnId: "lastUpdateTime",
        label: "最后修改时间",
        size: 150,
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
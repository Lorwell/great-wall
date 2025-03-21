import {ColumnDef} from "@tanstack/react-table";
import {columnCell, dataTableCheckboxColumn} from "@/components/custom-ui/data-table/data-table-column.tsx";
import dayjs from "dayjs";
import {Badge} from "@/components/ui/badge";
import RowActions, {RowActionsEvent} from "@/pages/app-routes/list/row-actions.tsx";
import {AppRouteListOutput, AppRouteStatusEnum} from "@/constant/api/app-routes/types.ts";
import {TargetConfigSchemaValues} from "@/constant/api/app-routes/schema.ts";
import {PredicatesColumn} from "@/pages/app-routes/list/predicates-column.tsx";
import {TargetConfigColumn} from "@/pages/app-routes/list/target-config-column.tsx";

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
        size: 250,
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
        size: 250,
        enableSorting: false,
        cell: ({getValue}) => {
          const value = getValue<TargetConfigSchemaValues>();
          return (
            <TargetConfigColumn targetConfig={value}/>
          )
        }
      }
    ),
    columnCell(
      {
        columnId: "priority",
        label: "优先级",
        size: 120,
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
        size: 100,
        cell: ({getValue}) => {
          const value = getValue() as AppRouteStatusEnum;
          if (AppRouteStatusEnum.ONLINE === value) {
            return (
              <Badge>在线</Badge>
            )
          } else if (AppRouteStatusEnum.OFFLINE === value) {
            return (
              <Badge variant={"secondary"}>下线</Badge>
            )
          }
          return (
            <Badge variant={"secondary"}>未知</Badge>
          )
        }
      }
    ),
    columnCell(
      {
        columnId: "createTime",
        label: "创建时间",
        size: 180,
        cell: ({getValue}) => dayjs(getValue()).format("YYYY-MM-DD HH:mm:ss")
      }
    ),
    columnCell(
      {
        columnId: "lastUpdateTime",
        label: "最后修改时间",
        size: 180,
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
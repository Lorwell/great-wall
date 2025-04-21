import {DataTable} from "@/components/custom-ui/data-table/data-table.tsx";
import {columns} from "@/pages/app-logs/list/columns.tsx";
import {RowContext} from "@/pages/app-logs/list/row-actions.tsx";
import useApiRequest from "@/components/hooks/use-api-request.ts";
import {logsList} from "@/constant/api/app-logs";
import {useNavigate} from "react-router-dom";
import {downloadFile} from "@/lib/utils.ts";

/**
 * 日志管理
 * @constructor
 */
export default function LogList() {
  const navigate = useNavigate();
  const {data, loading} = useApiRequest(logsList);

  /**
   * 查看事件
   * @param ctx
   */
  function handleView(ctx: RowContext) {
    const data = ctx.row.original;
    navigate(`/manage/logs/type/${data.type!.toLowerCase()}/file/${data.name}`)
  }

  /**
   * 下载事件
   * @param ctx
   */
  function handleDownload(ctx: RowContext) {
    const {type, name} = ctx.row.original;
    downloadFile(name!, `/api/logs/type/${type}/name/${name}/download`)
  }

  return (
    <div className={"w-full h-full"}>
      <DataTable data={data?.records || []}
                 loading={loading}
                 searchColumnId={"name"}
                 columns={columns({
                   event: {
                     onView: handleView,
                     onDownload: handleDownload,
                   }
                 })}
                 defaultSorting={[{id: "lastUpdateTime", desc: true}]}
                 filterOptions={[
                   {
                     type: "Enum",
                     columnId: "type",
                     label: "类型",
                     options: [
                       {label: "系统日志", value: "ROOT"},
                       {label: "访问日志", value: "ACCESS"},
                     ]
                   }
                 ]}
      />
    </div>
  )
}
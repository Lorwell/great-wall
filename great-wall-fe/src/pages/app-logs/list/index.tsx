import {DataTable} from "@/components/data-table/data-table.tsx";
import {columns} from "@/pages/app-logs/list/columns.tsx";
import {RowContext} from "@/pages/app-logs/list/row-actions.tsx";
import useApiRequest from "@/components/hooks/useApiRequest.ts";
import {logsList} from "@/constant/api/app-logs";
import {useNavigate} from "react-router-dom";

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

  return (
    <div className={"w-full h-full"}>
      <DataTable data={data?.records || []}
                 loading={loading}
                 searchColumnId={"name"}
                 manual={false}
                 columns={columns({
                   event: {
                     onView: handleView,
                   }
                 })}
                 plusOptions={[]}
      />
    </div>
  )
}
import {DataTable} from "@/components/data-table/data-table.tsx";
import {columns} from "@/pages/app-logs/list/columns.tsx";
import {RowContext} from "@/pages/app-logs/list/row-actions.tsx";
import useApiRequest from "@/components/hooks/useApiRequest.ts";
import {logsList} from "@/constant/api/app-logs";

/**
 * 日志管理
 * @constructor
 */
export default function LogList() {

  const {data, loading} = useApiRequest(logsList);

  /**
   * 查看事件
   * @param ctx
   */
  function handleView(ctx: RowContext) {
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
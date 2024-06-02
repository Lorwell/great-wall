import {DataTable} from "@/components/data-table/data-table.tsx";
import {columns} from "@/pages/app-routes/list/columns.tsx";
import {RowContext} from "@/pages/app-routes/list/row-actions.tsx";
import {useNavigate} from "react-router-dom";
import {LayoutPanelLeft} from "lucide-react";
import useApiRequest from "@/components/hooks/useApiRequest.ts";
import {appRouteList} from "@/constant/api/app-routes";


/**
 * 应用路由列表
 * @constructor
 */
function AppRoutesList() {

  const navigate = useNavigate();
  const {data,} = useApiRequest(appRouteList);

  /**
   * 查看事件
   * @param ctx
   */
  function handleView(ctx: RowContext) {
    const id = ctx.row.original.id
    navigate(`/manage/app-routes/${id}`)
  }

  /**
   * 编辑事件
   * @param ctx
   */
  function handleEdit(ctx: RowContext) {

  }

  /**
   * 下线事件
   * @param ctx
   */
  function handleOffline(ctx: RowContext) {

  }

  /**
   * 上线事件
   * @param ctx
   */
  function handleOnline(ctx: RowContext) {

  }

  return (
    <div className={"w-full h-full"}>
      <DataTable data={data?.records || []}
                 rowCount={data?.page.total}
                 searchColumnId={"name"}
                 manual={false}
                 columns={columns({
                   event: {
                     onView: handleView,
                     onEdit: handleEdit,
                     onOffline: handleOffline,
                     onOnline: handleOnline,
                   }
                 })}
                 plusOptions={[
                   {
                     label: "新建应用路由",
                     icon: LayoutPanelLeft,
                     onClick: () => navigate("/manage/app-routes/add/base-info"),
                   }
                 ]}
      />
    </div>
  )
}

export default AppRoutesList
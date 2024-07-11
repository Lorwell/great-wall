import {DataTable} from "@/components/data-table/data-table.tsx";
import {columns} from "@/pages/app-routes/list/columns.tsx";
import {RowContext} from "@/pages/app-routes/list/row-actions.tsx";
import {useNavigate} from "react-router-dom";
import {LayoutPanelLeft} from "lucide-react";
import useApiRequest from "@/components/hooks/useApiRequest.ts";
import {appRouteList, setAppRouteStatus} from "@/constant/api/app-routes";
import {AppRouteStatusEnum} from "@/constant/api/app-routes/types.ts";


/**
 * 应用路由列表
 * @constructor
 */
function AppRoutesList() {

  const navigate = useNavigate();
  const {
    data: appRouteListData,
    loading: appRouteListLoading,
    run: appRouteListRun
  } = useApiRequest(appRouteList);

  const {
    loading: setAppRouteStatusLoading,
    runAsync: setAppRouteStatusRun
  } = useApiRequest(setAppRouteStatus, {manual: true});

  /**
   * 查看事件
   * @param ctx
   */
  function handleView(ctx: RowContext) {
    const id = ctx.row.original.id!!
    navigate(`/manage/app-routes/${id}/preview`)
  }

  /**
   * 编辑事件
   * @param ctx
   */
  function handleEdit(ctx: RowContext) {
    const id = ctx.row.original.id!!
    navigate(`/manage/app-routes/${id}`)
  }

  /**
   * 下线事件
   * @param ctx
   */
  async function handleOffline(ctx: RowContext) {
    const id = ctx.row.original.id!!
    await setAppRouteStatusRun(id, AppRouteStatusEnum.OFFLINE)
    appRouteListRun()
  }

  /**
   * 上线事件
   * @param ctx
   */
  async function handleOnline(ctx: RowContext) {
    const id = ctx.row.original.id!!
    await setAppRouteStatusRun(id, AppRouteStatusEnum.ONLINE)
    appRouteListRun()
  }

  return (
    <div className={"w-full h-full"}>
      <DataTable data={appRouteListData?.records || []}
                 rowCount={appRouteListData?.page.total}
                 searchColumnId={"name"}
                 manual={false}
                 loading={appRouteListLoading || setAppRouteStatusLoading}
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
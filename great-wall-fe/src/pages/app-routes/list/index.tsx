import {DataTable} from "@/components/custom-ui/data-table/data-table.tsx";
import {columns} from "@/pages/app-routes/list/columns.tsx";
import {RowContext} from "@/pages/app-routes/list/row-actions.tsx";
import {useNavigate} from "react-router-dom";
import {LayoutPanelLeft} from "lucide-react";
import useApiRequest from "@/components/hooks/use-api-request.ts";
import {appRouteList, batchDeleteAppRoute, updateAppRouteStatus} from "@/constant/api/app-routes";
import {AppRouteListOutput, AppRouteStatusEnum} from "@/constant/api/app-routes/types.ts";
import {useDataTableApiRequest} from "@/components/custom-ui/data-table/use-data-table-api-request.ts";
import {filterOptions} from "@/pages/app-routes/list/filter-options.ts";
import {Row} from "@tanstack/react-table";


/**
 * 应用路由列表
 * @constructor
 */
function AppRoutesList() {

  const navigate = useNavigate();

  const {
    records,
    page,
    loading,
    pageState,
    setPageState,
    onTableChange,
    refresh
  } = useDataTableApiRequest((input) => appRouteList(input), {
    filterOptions: filterOptions
  });

  const {
    runAsync: updateAppRouteStatusRun
  } = useApiRequest(updateAppRouteStatus, {manual: true});

  const {
    runAsync: batchDeleteAppRouteRun
  } = useApiRequest(batchDeleteAppRoute, {manual: true});

  /**
   * 查看事件
   * @param ctx
   */
  function handleView(ctx: RowContext) {
    const id = ctx.row.original.id!
    navigate(`/manage/app-routes/${id}/preview`)
  }

  /**
   * 编辑事件
   * @param ctx
   */
  function handleEdit(ctx: RowContext) {
    const id = ctx.row.original.id!
    navigate(`/manage/app-routes/${id}/base-info`)
  }

  /**
   * 下线事件
   * @param ctx
   */
  async function handleOffline(ctx: RowContext) {
    const id = ctx.row.original.id!
    await updateAppRouteStatusRun(id, AppRouteStatusEnum.OFFLINE)
    refresh()
  }

  /**
   * 上线事件
   * @param ctx
   */
  async function handleOnline(ctx: RowContext) {
    const id = ctx.row.original.id!
    await updateAppRouteStatusRun(id, AppRouteStatusEnum.ONLINE)
    refresh()
  }

  /**
   * 删除事件
   */
  async function handleDelete(rows: Row<AppRouteListOutput>[]) {
    await batchDeleteAppRouteRun({
      ids: rows.map(it => it.original.id!)
    })
    refresh()
  }

  return (
    <div className={"w-full h-full"}>
      <DataTable
        data={records || []}
        pagination={pageState}
        rowCount={page?.total}
        onPaginationChange={setPageState}
        onChange={onTableChange}
        loading={loading}
        columns={columns({
          event: {
            onView: handleView,
            onEdit: handleEdit,
            onOffline: handleOffline,
            onOnline: handleOnline,
          }
        })}
        filterOptions={filterOptions}
        plusOptions={[
          {
            label: "新建应用路由",
            icon: LayoutPanelLeft,
            onClick: () => navigate("/manage/app-routes/add/base-info"),
          }
        ]}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default AppRoutesList
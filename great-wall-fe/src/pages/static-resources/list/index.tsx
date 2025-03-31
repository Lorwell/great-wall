import {DataTable} from "@/components/custom-ui/data-table/data-table.tsx";
import {columns} from "./columns.tsx";
import {useDataTableApiRequest} from "@/components/custom-ui/data-table/use-data-table-api-request.ts";
import {deleteStaticResources, staticResourcesList} from "@/constant/api/static-resources";
import {LayoutPanelLeft} from "lucide-react";
import {useNavigate} from "react-router-dom";
import useApiRequest from "@/components/hooks/use-api-request.ts";
import {toast} from "sonner";

/**
 * 静态资源列表
 * @constructor
 */
export default function StaticResourcesList() {
  const navigate = useNavigate();

  const {
    records,
    page,
    loading,
    pageState,
    setPageState,
    onTableChange,
    refresh
  } = useDataTableApiRequest((input) => staticResourcesList(input));

  const {
    runAsync: deleteRunAsync
  } = useApiRequest(deleteStaticResources, {manual: true});

  /**
   * 删除文件
   */
  async function handleDelete(ids: number[]) {
    await toast.promise(
      async () => {
        for (let id of ids) {
          await deleteRunAsync(id)
        }
      },
      {
        loading: "正在删除...",
        success: "删除成功...",
        error: "删除失败...",
        finally: () => {
          refresh()
        }
      }).unwrap()
  }

  return (
    <DataTable
      data={records || []}
      pagination={pageState}
      rowCount={page?.total}
      onPaginationChange={setPageState}
      onChange={onTableChange}
      loading={loading}
      columns={columns({
        event: {
          onEdit: ({row}) => {
            navigate(`/manage/static-resources/${row.original.id}/update`)
          },
          onViewFiles: ({row}) => {
            navigate(`/manage/static-resources/${row.original.id}/files`)
          }
        }
      })}
      plusOptions={[
        {
          label: "新建静态资源",
          icon: LayoutPanelLeft,
          onClick: () => navigate("/manage/static-resources/add"),
        }
      ]}
      onDelete={async (rows) => {
        await handleDelete(rows.map(it => it.original.id))
      }}
    />
  )
}
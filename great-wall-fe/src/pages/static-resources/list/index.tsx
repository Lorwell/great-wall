import {DataTable} from "@/components/custom-ui/data-table/data-table.tsx";
import {columns} from "./columns.tsx";
import {useDataTableApiRequest} from "@/components/custom-ui/data-table/use-data-table-api-request.ts";
import {staticResourcesList} from "@/constant/api/static-resources";
import {LayoutPanelLeft} from "lucide-react";
import {useNavigate} from "react-router-dom";

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
  } = useDataTableApiRequest((input) => staticResourcesList(input));

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
    />
  )
}
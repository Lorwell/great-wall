import {DataTableFilter} from "@/components/custom-ui/data-table/types";

/**
 * 过滤条件
 */
export const filterOptions: DataTableFilter[] = [
  {
    type: "Enum",
    columnId: "status",
    label: "状态",
    options: [
      {label: "在线", value: "ONLINE"},
      {label: "下线", value: "OFFLINE"},
    ]
  }
]
import {ReactNode} from "react";
import {RouteFilterEnum} from "@/constant/api/app-routes/types.ts";

interface FilterConfig {
  key: string
  label: string | ReactNode
  filters: Array<RouteFilterEnum>
}

/**
 * 过滤器配置
 */
const filterConfig: Array<FilterConfig> = [
  {
    key: "authentication",
    label: "身份验证",
    filters: [
      RouteFilterEnum.BasicAuth
    ]
  },
  {
    key: "security-protection",
    label: "安全防护",
    filters: []
  },
  {
    key: "flow-control",
    label: "流量控制",
    filters: []
  },
  {
    key: "request-mutate",
    label: "请求修改",
    filters: []
  }
]

export default filterConfig
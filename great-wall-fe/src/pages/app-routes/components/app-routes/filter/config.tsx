import {ReactNode} from "react";
import {RouteFilterEnum} from "@/constant/api/app-routes/types.ts";

export interface RoutesProps<T> {
  value?: T,
  onChange?: (value: T) => Promise<boolean | void> | void | boolean
  onRemove?: () => Promise<void> | void
  enable?: boolean | "preview"
  showDescription?: boolean
  disabled?: boolean
}

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
    filters: [
      RouteFilterEnum.TokenBucketRequestRateLimiter
    ]
  },
  {
    key: "request-mutate",
    label: "请求修改",
    filters: [
      RouteFilterEnum.PreserveHostHeader,
      RouteFilterEnum.AddRequestHeaders,
      RouteFilterEnum.AddRequestQueryParameters,
      RouteFilterEnum.AddResponseHeaders,
      RouteFilterEnum.RemoveRequestHeaders,
      RouteFilterEnum.RemoveRequestQueryParameters,
      RouteFilterEnum.RemoveResponseHeaders,
    ]
  }
]


export default filterConfig
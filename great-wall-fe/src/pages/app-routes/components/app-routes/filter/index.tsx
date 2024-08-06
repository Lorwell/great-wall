import {FilterFormValues} from "@/constant/api/app-routes/schema.ts";
import BasicAuth from "@/pages/app-routes/components/app-routes/filter/basic-auth.tsx";
import {RouteFilterEnum} from "@/constant/api/app-routes/types.ts";
import TokenBucketRequestRateLimiter
  from "@/pages/app-routes/components/app-routes/filter/token-bucket-request-rate-limiter.tsx";
import PreserveHostHeader from "@/pages/app-routes/components/app-routes/filter/preserve-host-header.tsx";
import AddRequestHeaders from "@/pages/app-routes/components/app-routes/filter/add-request-headers.tsx";
import AddResponseHeaders from "@/pages/app-routes/components/app-routes/filter/add-response-headers.tsx";
import AddRequestQueryParameters
  from "@/pages/app-routes/components/app-routes/filter/add-request-query-parameters.tsx";
import RemoveRequestHeaders from "@/pages/app-routes/components/app-routes/filter/remove-request-headers.tsx";
import RemoveResponseHeaders from "@/pages/app-routes/components/app-routes/filter/remove-response-headers.tsx";
import {Fingerprint} from "lucide-react";
import FilterCard from "@/pages/app-routes/components/app-routes/filter/filter-card.tsx";
import RemoveRequestQueryParameters
  from "@/pages/app-routes/components/app-routes/filter/remove-request-query-parameters.tsx";
import SideWindowRequestRateLimiter
  from "@/pages/app-routes/components/app-routes/filter/slide-window-request-rate-limiter.tsx";

export interface FilterProps {
  type: RouteFilterEnum,
  value?: FilterFormValues
  onChange?: (value: FilterFormValues) => Promise<boolean | void> | void | boolean
  onRemove?: () => Promise<void> | void
  enable?: boolean | "preview"
  showDescription?: boolean
  disabled?: boolean
}

/**
 * 过滤器
 * @param props
 * @constructor
 */
export default function Filter(props: FilterProps) {
  const {
    type,
  } = props

  switch (type) {
    case RouteFilterEnum.BasicAuth:
      // @ts-ignore
      return <BasicAuth {...props}/>
    case RouteFilterEnum.TokenBucketRequestRateLimiter:
      // @ts-ignore
      return <TokenBucketRequestRateLimiter {...props}/>
    case RouteFilterEnum.PreserveHostHeader:
      // @ts-ignore
      return <PreserveHostHeader {...props}/>
    case RouteFilterEnum.AddRequestHeaders:
      // @ts-ignore
      return <AddRequestHeaders {...props}/>
    case RouteFilterEnum.AddRequestQueryParameters:
      // @ts-ignore
      return <AddRequestQueryParameters {...props}/>
    case RouteFilterEnum.AddResponseHeaders:
      // @ts-ignore
      return <AddResponseHeaders {...props}/>
    case RouteFilterEnum.RemoveRequestHeaders:
      // @ts-ignore
      return <RemoveRequestHeaders {...props}/>
    case RouteFilterEnum.RemoveRequestQueryParameters:
      // @ts-ignore
      return <RemoveRequestQueryParameters {...props}/>
    case RouteFilterEnum.RemoveResponseHeaders:
      // @ts-ignore
      return <RemoveResponseHeaders {...props}/>
    case RouteFilterEnum.SlideWindowRequestRateLimiter:
      // @ts-ignore
      return <SideWindowRequestRateLimiter {...props}/>
  }

  return (
    <FilterCard title={"未知的类型"}
                icon={<Fingerprint className={"w-6 h-6"}/>}
                category={"未知"}
                description={(<span>{type}</span>)}
                showDescription={true}
    >
      <span>未知的类型: {type}</span>
    </FilterCard>
  )
}
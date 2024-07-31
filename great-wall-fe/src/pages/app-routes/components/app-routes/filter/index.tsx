import {FilterFormValues} from "@/constant/api/app-routes/schema.ts";
import BasicAuth from "@/pages/app-routes/components/app-routes/filter/basic-auth.tsx";
import {RouteFilterEnum} from "@/constant/api/app-routes/types.ts";

export interface FilterProps {
  type:RouteFilterEnum,
  value?: FilterFormValues
  onChange?: (value: FilterFormValues) => Promise<boolean | void> | void | boolean
  onRemove?: () => Promise<void> | void
  enable?: boolean
  showDescription?: boolean
}

/**
 * 过滤器
 * @param props
 * @constructor
 */
export default function Filter(props: FilterProps) {
  const {
    type,
    enable = true,
    showDescription = false
  } = props

  switch (type) {
    case "BasicAuth":
      return <BasicAuth {...props} enable={enable} showDescription={showDescription}/>
    default:
      return (
        <div>
          未知的类型
        </div>
      )
  }
}
import {DropdownMenuTrigger} from "@radix-ui/react-dropdown-menu";
import {CirclePlus} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu.tsx";
import {cn} from "@/utils/shadcnUtils.ts";


export interface RoutePredicatesPlusOptionsProps {

  onAddMethodPredicate?: () => void
  onAddQueryParamPredicate?: () => void
  onAddHeaderPredicate?: () => void
  onAddCookiePredicate?: () => void
  onAddHostPredicate?: () => void
  onAddPathPredicate?: () => void
  onAddRemoteAddrPredicate?: () => void

}

/**
 * 添加路由条件选项
 * @param props
 * @constructor
 */
function RoutePredicatesPlusOptions(props: RoutePredicatesPlusOptionsProps) {

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <CirclePlus className={cn("cursor-pointer h-6 w-6")}/>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[150px]">
        <DropdownMenuLabel>添加路由条件</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuItem onClick={props.onAddMethodPredicate}>
          请求方式
        </DropdownMenuItem>
        <DropdownMenuItem onClick={props.onAddQueryParamPredicate}>
          查询参数
        </DropdownMenuItem>
        <DropdownMenuItem onClick={props.onAddHeaderPredicate}>
          请求头
        </DropdownMenuItem>
        <DropdownMenuItem onClick={props.onAddCookiePredicate}>
          Cookie
        </DropdownMenuItem>
        <DropdownMenuItem onClick={props.onAddHostPredicate}>
          Host
        </DropdownMenuItem>
        <DropdownMenuItem onClick={props.onAddPathPredicate}>
          请求路径
        </DropdownMenuItem>
        <DropdownMenuItem onClick={props.onAddRemoteAddrPredicate}>
          RemoteAddr
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default RoutePredicatesPlusOptions
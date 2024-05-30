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
import {Button} from "@/components/ui/button.tsx";
import {PredicatesSchemaValues} from "@/pages/app-routes/components/app-routes/schema.ts";
import {PredicateTypeEnum} from "@/constant/api/app-routes/types.ts";


export interface RoutePredicatesPlusOptionsProps {
  disabled?: boolean
  onAddPredicate: (predicate: PredicatesSchemaValues) => void
}

/**
 * 添加路由条件选项
 * @param props
 * @constructor
 */
function RoutePredicatesPlusOptions(props: RoutePredicatesPlusOptionsProps) {
  const {onAddPredicate, disabled = false} = props

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"outline"} size={"icon"} disabled={disabled}>
          <CirclePlus className={cn("cursor-pointer h-5 w-5")}/>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-[150px]">
        <DropdownMenuLabel>添加路由条件</DropdownMenuLabel>
        <DropdownMenuSeparator/>
        <DropdownMenuItem
          onClick={() =>
            onAddPredicate(
              {
                type: PredicateTypeEnum.Method,
                methods: []
              })}
        >
          请求方式
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() =>
          onAddPredicate(
            {
              type: PredicateTypeEnum.Query,
              name: "",
              regexp: ""
            })}>
          查询参数
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() =>
          onAddPredicate(
            {
              type: PredicateTypeEnum.Header,
              name: "",
              regexp: ""
            })}>
          请求头
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() =>
          onAddPredicate(
            {
              type: PredicateTypeEnum.Cookie,
              name: "",
              regexp: ""
            })}>
          Cookie
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() =>
          onAddPredicate(
            {
              type: PredicateTypeEnum.Host,
              patterns: []
            })}>
          Host
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() =>
          onAddPredicate(
            {
              type: PredicateTypeEnum.Path,
              patterns: [],
              matchTrailingSlash: true
            })}>
          请求路径
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() =>
          onAddPredicate(
            {
              type: PredicateTypeEnum.RemoteAddr,
              sources: []
            })}>
          RemoteAddr
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default RoutePredicatesPlusOptions
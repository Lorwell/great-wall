import {RoutePredicateOperatorEnum} from "@/constant/api/app-routes/types.ts";

/**
 * 路由条件操作符转为中文
 * @param type
 */
export function routePredicateOperatorEnumToChinese(type: RoutePredicateOperatorEnum): string {
  switch (type) {
    case RoutePredicateOperatorEnum.AND:
      return "与"
    case RoutePredicateOperatorEnum.OR:
      return "或"
    default:
      return ""
  }
}
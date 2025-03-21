import {
  CookiePredicatesSchemaValues,
  HeaderPredicatesSchemaValues,
  HostPredicatesSchemaValues,
  MethodPredicatesSchemaValues,
  PathPredicatesSchemaValues,
  PredicatesOperatorSchemaValues,
  PredicatesValues,
  QueryPredicatesSchemaValues,
  RemoteAddrPredicatesSchemaValues
} from "@/constant/api/app-routes/schema.ts";
import {RoutePredicateOperatorEnum} from "@/constant/api/app-routes/types.ts";
import {routePredicateOperatorEnumToChinese} from "@/pages/app-routes/utils.ts";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card"
import {cn} from "@/lib/shadcnUtils.ts";

export type PredicatesColumnProps = {
  predicates: PredicatesValues
}

/**
 * 路由条件列
 * @constructor
 */
export function PredicatesColumn(props: PredicatesColumnProps) {
  const {predicates} = props

  return (
    <HoverCard>
      <HoverCardTrigger asChild>
        <div className={"w-full"}>
          {
            predicates.map((it, index) => (
              <Predicates key={index} value={it} first={index === 0} viewOperator={predicates.length > 1}/>
            ))
          }
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className={"text-base font-bold mb-2"}>路由条件：</div>
        <div className={"table table-auto border-separate border-spacing-1"}>
          {
            predicates.map((it, index) => (
              <Predicates key={index} value={it} first={index === 0} viewOperator={predicates.length > 1}/>
            ))
          }
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

function Predicates({value, first = false, viewOperator = true}: {
  value: PredicatesOperatorSchemaValues,
  first?: boolean,
  viewOperator?: boolean
}) {
  const {predicate, operator} = value
  const {type} = predicate
  switch (type) {
    case "Host":
      return (
        <HostPredicates value={predicate}
                        first={first}
                        operator={operator}
                        viewOperator={viewOperator}
        />
      )
    case "Cookie":
      return (
        <KVPredicates kvType="Cookie"
                      value={predicate}
                      first={first}
                      operator={operator}
                      viewOperator={viewOperator}
        />
      )
    case "Header":
      return (
        <KVPredicates kvType="Header"
                      value={predicate}
                      first={first}
                      operator={operator}
                      viewOperator={viewOperator}
        />
      )
    case "Query":
      return (
        <KVPredicates kvType="Query"
                      value={predicate}
                      first={first}
                      operator={operator}
                      viewOperator={viewOperator}
        />
      )
    case "Method":
      return (
        <MethodPredicates value={predicate}
                          first={first}
                          operator={operator}
                          viewOperator={viewOperator}
        />
      )
    case "Path":
      return (
        <PathPredicates value={predicate}
                        first={first}
                        operator={operator}
                        viewOperator={viewOperator}
        />
      )
    case "RemoteAddr":
      return (
        <RemoteAddrPredicates value={predicate}
                              first={first}
                              operator={operator}
                              viewOperator={viewOperator}
        />
      )
  }

  throw new Error(`未知的类型 ${type}`)
}

function KVPredicates({kvType, value, first, operator, viewOperator = true}: {
  kvType: "Cookie" | "Query" | "Header",
  value: CookiePredicatesSchemaValues | HeaderPredicatesSchemaValues | QueryPredicatesSchemaValues,
  first: boolean,
  operator?: RoutePredicateOperatorEnum,
  viewOperator?: boolean
}) {
  const {name, regexp} = value

  return (
    <div className={"w-full flex gap-1"}>
      {
        viewOperator && (
          <div className={"w-4 min-w-4 text-left"}>
            {!first && !!operator ? routePredicateOperatorEnumToChinese(operator) : ""}
          </div>
        )
      }

      <div className={cn({"w-32 max-w-32 min-w-32 text-right": viewOperator})}>
        {kvType} 匹配规则：
      </div>

      <div
        className={"flex-auto text-left truncate"}
      >
        {name}={regexp}
      </div>
    </div>
  )
}

function HostPredicates({value, first, operator, viewOperator = true}: {
  value: HostPredicatesSchemaValues,
  first: boolean,
  operator?: RoutePredicateOperatorEnum,
  viewOperator?: boolean
}) {
  const {patterns} = value

  return (
    <div className={"w-full flex gap-1"}>
      {
        viewOperator && (
          <div className={"w-4 min-w-4 text-left"}>
            {!first && !!operator ? routePredicateOperatorEnumToChinese(operator) : ""}
          </div>
        )
      }

      <div className={cn({"w-32 max-w-32 min-w-32 text-right": viewOperator})}>
        Host 匹配规则：
      </div>

      <div
        className={"flex-auto text-left truncate"}
      >
        {
          patterns.map((it, i) => (
            <span key={i}>
              {it}{(i + 1) < patterns.length && ", "}
            </span>
          ))
        }
      </div>
    </div>
  )
}

function MethodPredicates({value, first, operator, viewOperator = true}: {
  value: MethodPredicatesSchemaValues,
  first: boolean,
  operator?: RoutePredicateOperatorEnum,
  viewOperator?: boolean
}) {
  const {methods} = value

  return (
    <div className={"w-full flex gap-1"}>
      {
        viewOperator && (
          <div className={"w-4 min-w-4 text-left"}>
            {!first && !!operator ? routePredicateOperatorEnumToChinese(operator) : ""}
          </div>
        )
      }

      <div className={cn({"w-32 max-w-32 min-w-32 text-right": viewOperator})}>
        Method 匹配规则：
      </div>

      <div
        className={"flex-auto text-left truncate"}
      >
        {
          methods.map((it, i) => (
            <span key={i}>
              {it}{(i + 1) < methods.length && ", "}
            </span>
          ))
        }
      </div>
    </div>
  )
}

function PathPredicates({value, first, operator, viewOperator = true}: {
  value: PathPredicatesSchemaValues,
  first: boolean,
  operator?: RoutePredicateOperatorEnum,
  viewOperator?: boolean
}) {
  const {patterns} = value

  return (
    <div className={"w-full flex gap-1"}>
      {
        viewOperator && (
          <div className={"w-4 min-w-4 text-left"}>
            {!first && !!operator ? routePredicateOperatorEnumToChinese(operator) : ""}
          </div>
        )
      }

      <div className={cn({"w-32 max-w-32 min-w-32 text-right": viewOperator})}>
        Path 匹配规则：
      </div>

      <div
        className={"flex-auto text-left truncate"}
      >
        {
          patterns.map((it, i) => (
            <span key={i}>
              {it}{(i + 1) < patterns.length && ", "}
            </span>
          ))
        }
      </div>
    </div>
  )
}

function RemoteAddrPredicates({value, first, operator, viewOperator = true}: {
  value: RemoteAddrPredicatesSchemaValues,
  first: boolean,
  operator?: RoutePredicateOperatorEnum,
  viewOperator?: boolean
}) {
  const {sources} = value

  return (
    <div className={"w-full flex gap-1"}>
      {
        viewOperator && (
          <div className={"w-4 min-w-4 text-left"}>
            {!first && !!operator ? routePredicateOperatorEnumToChinese(operator) : ""}
          </div>
        )
      }

      <div className={cn({"w-32 max-w-32 min-w-32 text-right": viewOperator})}>
        Path 匹配规则：
      </div>

      <div
        className={"flex-auto text-left truncate"}
      >
        {
          sources.map((it, i) => (
            <span key={i}>
              {it}{(i + 1) < sources.length && ", "}
            </span>
          ))
        }
      </div>
    </div>
  )
}
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
              <Predicates key={index} value={it} first={index === 0}/>
            ))
          }
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className={"text-base font-bold mb-2"}>路由条件：</div>
        <div className={"table table-auto border-separate border-spacing-1"}>
          {
            predicates.map((it, index) => (
              <Predicates key={index} value={it} first={index === 0}/>
            ))
          }
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

function Predicates({value, first = false}: {
  value: PredicatesOperatorSchemaValues,
  first?: boolean,
}) {
  const {predicate, operator} = value
  const {type} = predicate
  switch (type) {
    case "Host":
      return (
        <HostPredicates value={predicate}
                        first={first}
                        operator={operator}
        />
      )
    case "Cookie":
      return (
        <KVPredicates kvType="Cookie"
                      value={predicate}
                      first={first}
                      operator={operator}
        />
      )
    case "Header":
      return (
        <KVPredicates kvType="Header"
                      value={predicate}
                      first={first}
                      operator={operator}
        />
      )
    case "Query":
      return (
        <KVPredicates kvType="Query"
                      value={predicate}
                      first={first}
                      operator={operator}
        />
      )
    case "Method":
      return (
        <MethodPredicates value={predicate}
                          first={first}
                          operator={operator}
        />
      )
    case "Path":
      return (
        <PathPredicates value={predicate}
                        first={first}
                        operator={operator}
        />
      )
    case "RemoteAddr":
      return (
        <RemoteAddrPredicates value={predicate}
                              first={first}
                              operator={operator}
        />
      )
  }

  throw new Error(`未知的类型 ${type}`)
}

function KVPredicates({kvType, value, first, operator}: {
  kvType: "Cookie" | "Query" | "Header",
  value: CookiePredicatesSchemaValues | HeaderPredicatesSchemaValues | QueryPredicatesSchemaValues,
  first: boolean,
  operator?: RoutePredicateOperatorEnum,
}) {
  const {name, regexp} = value

  return (
    <div className={"w-full flex gap-1"}>
      <div className={"w-4 min-w-4 text-left"}>
        {!first && !!operator ? routePredicateOperatorEnumToChinese(operator) : ""}
      </div>

      <div className={"w-32 max-w-32 min-w-32 text-right"}>{kvType} 匹配规则：</div>

      <div
        className={"flex-auto text-left truncate"}
      >
        {name}={regexp}
      </div>
    </div>
  )
}

function HostPredicates({value, first, operator,}: {
  value: HostPredicatesSchemaValues,
  first: boolean,
  operator?: RoutePredicateOperatorEnum,
}) {
  const {patterns} = value

  return (
    <div className={"w-full flex gap-1"}>
      <div className={"w-4 min-w-4 text-left"}>
        {!first && !!operator ? routePredicateOperatorEnumToChinese(operator) : ""}
      </div>

      <div className={"w-32 max-w-32 min-w-32 text-right"}>Host 匹配规则：</div>

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

function MethodPredicates({value, first, operator}: {
  value: MethodPredicatesSchemaValues,
  first: boolean,
  operator?: RoutePredicateOperatorEnum,
}) {
  const {methods} = value

  return (
    <div className={"w-full flex gap-1"}>
      <div className={"w-4 min-w-4 text-left"}>
        {!first && !!operator ? routePredicateOperatorEnumToChinese(operator) : ""}
      </div>

      <div className={"w-32 max-w-32 min-w-32 text-right"}>Method 匹配规则：</div>

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

function PathPredicates({value, first, operator}: {
  value: PathPredicatesSchemaValues,
  first: boolean,
  operator?: RoutePredicateOperatorEnum,
}) {
  const {patterns} = value

  return (
    <div className={"w-full flex gap-1"}>
      <div className={"w-4 min-w-4 text-left"}>
        {!first && !!operator ? routePredicateOperatorEnumToChinese(operator) : ""}
      </div>

      <div className={"w-32 max-w-32 min-w-32 text-right"}>Path 匹配规则：</div>

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

function RemoteAddrPredicates({value, first, operator}: {
  value: RemoteAddrPredicatesSchemaValues,
  first: boolean,
  operator?: RoutePredicateOperatorEnum,
}) {
  const {sources} = value

  return (
    <div className={"w-full flex gap-1"}>
      <div className={"w-4 min-w-4 text-left"}>
        {!first && !!operator ? routePredicateOperatorEnumToChinese(operator) : ""}
      </div>

      <div className={"w-32 max-w-32 min-w-32 text-right"}>Path 匹配规则：</div>

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
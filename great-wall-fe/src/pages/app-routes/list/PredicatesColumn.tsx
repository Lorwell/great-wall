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

export interface PredicatesColumnProps {
  predicates: PredicatesValues
}

/**
 * 路由条件列
 * @constructor
 */
export default function PredicatesColumn(props: PredicatesColumnProps) {
  const {predicates} = props

  return (
    <div className={"table table-auto border-separate border-spacing-1"}>
      {
        predicates.map((it, index) => (
          <Predicates key={index} value={it} first={index === 0} viewOperator/>
        ))
      }
    </div>
  )
}

function Predicates({value, first = false, viewOperator = false}: {
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

function KVPredicates({kvType, value, first, operator, viewOperator = false}: {
  kvType: "Cookie" | "Query" | "Header",
  value: CookiePredicatesSchemaValues | HeaderPredicatesSchemaValues | QueryPredicatesSchemaValues,
  first: boolean,

  operator?: RoutePredicateOperatorEnum,
  viewOperator?: boolean
}) {
  const {name, regexp} = value

  return (
    <div className={"table-row"}>
      {
        (viewOperator && !!operator) && (
          <div className={"table-cell text-left pr-1"}>
            {!first ? routePredicateOperatorEnumToChinese(operator) : ""}
          </div>
        )
      }

      <div className={"table-cell text-right"}>{kvType} 匹配规则：</div>

      <div className={"table-cell text-left truncate"}>
        {name}={regexp}
      </div>
    </div>
  )
}

function HostPredicates({value, first, operator, viewOperator = false}: {
  value: HostPredicatesSchemaValues,
  first: boolean,

  operator?: RoutePredicateOperatorEnum,
  viewOperator?: boolean
}) {
  const {patterns} = value

  return (
    <div className={"table-row"}>
      {
        (viewOperator && !!operator) && (
          <div className={"table-cell text-left pr-1"}>
            {!first ? routePredicateOperatorEnumToChinese(operator) : ""}
          </div>
        )
      }

      <div className={"table-cell text-right"}>Host 匹配规则：</div>

      <div className={"table-cell text-left truncate"}>
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

function MethodPredicates({value, first, operator, viewOperator = false}: {
  value: MethodPredicatesSchemaValues,
  first: boolean,

  operator?: RoutePredicateOperatorEnum,
  viewOperator?: boolean
}) {
  const {methods} = value

  return (
    <div className={"table-row"}>
      {
        (viewOperator && !!operator) && (
          <div className={"table-cell text-left pr-1"}>
            {!first ? routePredicateOperatorEnumToChinese(operator) : ""}
          </div>
        )
      }

      <div className={"table-cell text-right"}>Method 匹配规则：</div>

      <div className={"table-cell text-left truncate"}>
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

function PathPredicates({value, first, operator, viewOperator = false}: {
  value: PathPredicatesSchemaValues,
  first: boolean,

  operator?: RoutePredicateOperatorEnum,
  viewOperator?: boolean
}) {
  const {patterns} = value

  return (
    <div className={"table-row"}>
      {
        (viewOperator && !!operator) && (
          <div className={"table-cell text-left pr-1"}>
            {!first ? routePredicateOperatorEnumToChinese(operator) : ""}
          </div>
        )
      }

      <div className={"table-cell text-right"}>Path 匹配规则：</div>

      <div className={"table-cell text-left truncate"}>
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

function RemoteAddrPredicates({value, first, operator, viewOperator = false}: {
  value: RemoteAddrPredicatesSchemaValues,
  first: boolean,

  operator?: RoutePredicateOperatorEnum,
  viewOperator?: boolean
}) {
  const {sources} = value

  return (
    <div className={"table-row"}>
      {
        (viewOperator && !!operator) && (
          <div className={"table-cell text-left pr-1"}>
            {!first ? routePredicateOperatorEnumToChinese(operator) : ""}
          </div>
        )
      }

      <div className={"table-cell text-right"}>Path 匹配规则：</div>

      <div className={"table-cell text-left truncate"}>
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
import {
  CookiePredicatesSchemaValues,
  HostPredicatesSchemaValues,
  PredicatesSchemaValues,
  PredicatesValues
} from "@/constant/api/app-routes/schema.ts";
import {PredicateTypeEnum} from "@/constant/api/app-routes/types.ts";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.tsx";
import {Badge} from "@/components/ui/badge.tsx";

export interface PredicatesColumnProps {
  predicates: PredicatesValues
}

/**
 * 路由条件列
 * @constructor
 */
export default function PredicatesColumn(props: PredicatesColumnProps) {
  const {predicates} = props
  const {predicate} = predicates[0];

  return (
    <div className={"w-full flex gap-1"}>
      <div style={{width: "calc(100% - 25px)"}}>
        <Predicates prefix={false} value={predicate}/>
      </div>
      <HoverCard>
        <HoverCardTrigger>
          <Badge variant={"secondary"} className={"cursor-pointer"}>{predicates.length}</Badge>
        </HoverCardTrigger>
        <HoverCardContent>
          <div className={"flex flex-col gap-1"}>
            {
              predicates.map((it, index) => (
                <Predicates key={index} value={it.predicate}/>
              ))
            }
          </div>
        </HoverCardContent>
      </HoverCard>
    </div>
  )
}

function Predicates({value, prefix = true}: { value: PredicatesSchemaValues, prefix?: boolean }) {
  switch (value.type) {
    case "Host":
      return (<HostPredicates prefix={prefix} value={value}/>)
    case "Cookie":
      return (<CookiePredicates prefix={prefix} value={value}/>)
    case "Header":
      break;
    case "Query":
      break;
    case "Method":
      break;
    case "Path":
      break;
    case "RemoteAddr":
      break;
  }

  return (
    <div></div>
  )
}

function CookiePredicates({value, prefix = true}: { value: CookiePredicatesSchemaValues, prefix?: boolean }) {
  const {name, regexp} = value

  return (
    <div className={"flex flex-row truncate"}>
      {
        prefix && (
          <div className={"basis-1/3"}>Cookie 匹配规则：</div>
        )
      }

      <div className={"basis-2/3"}>
        {name}={regexp}
      </div>
    </div>
  )
}

function HostPredicates({value, prefix = true}: { value: HostPredicatesSchemaValues, prefix?: boolean }) {
  const {patterns} = value

  return (
    <div className={"flex flex-row truncate"}>
      {
        prefix && (
          <div className={"basis-1/3"}>Host 匹配规则：</div>
        )
      }

      {
        patterns.map((it, i) => (
          <div key={i} className={"basis-2/3"}>
            {it}{(i + 1) < patterns.length && ", "}
          </div>
        ))
      }
    </div>
  )
}
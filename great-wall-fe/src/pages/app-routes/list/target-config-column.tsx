import {TargetConfigSchemaValues} from "@/constant/api/app-routes/schema.ts";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card"

export type TargetConfigColumnProps = {
  targetConfig: TargetConfigSchemaValues
}

/**
 * 目标地址
 * @constructor
 */
export function TargetConfigColumn({targetConfig}: TargetConfigColumnProps) {
  const {urls} = targetConfig

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div className={"flex flex-col gap-1"}>
          {urls.map((it, index) => (
            <div key={index} className={"flex"}>
              <div className={"truncate flex-auto"}>{it.url}</div>
              <div className={"mx-3"}>-</div>
              <div className={"w-12"}>权重：</div>
              <div>{it.weight}</div>
            </div>
          ))}
        </div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className={"text-base font-bold mb-2"}>目标地址：</div>
        <div className={"flex flex-col gap-1"}>
          {urls.map((it, index) => (
            <div key={index} className={"flex"}>
              <div>{it.url}</div>
              <div className={"mx-3"}>-</div>
              <div>权重：</div>
              <div>{it.weight}</div>
            </div>
          ))}
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}
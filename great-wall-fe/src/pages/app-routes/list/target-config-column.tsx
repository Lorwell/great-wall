import {
  RouteStaticResourcesTargetConfigSchemaValues,
  RouteUrlsTargetConfigSchemaValues,
  TargetConfigSchemaValues
} from "@/constant/api/app-routes/schema.ts";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card"
import {RouteTargetEnum} from "@/constant/api/app-routes/types.ts";
import useApiRequest from "@/components/hooks/use-api-request.ts";
import {staticResourcesDetails} from "@/constant/api/static-resources";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import {useNavigate} from "react-router-dom";

export type TargetConfigColumnProps = {
  targetConfig: TargetConfigSchemaValues
}

/**
 * 目标地址
 * @constructor
 */
export function TargetConfigColumn({targetConfig}: TargetConfigColumnProps) {
  const {type} = targetConfig;
  if (type === RouteTargetEnum.Urls) {
    return (
      <RouteUrlsTargetConfigColumn targetConfig={targetConfig}/>
    )
  } else if (type === RouteTargetEnum.StaticResources) {
    return (
      <RouteStaticResourcesTargetConfigColumn targetConfig={targetConfig}/>
    )
  } else {
    throw new Error(`未知的类型：${type}`)
  }

}

function RouteStaticResourcesTargetConfigColumn(
  {
    targetConfig
  }: { targetConfig: RouteStaticResourcesTargetConfigSchemaValues }) {
  const {id, index, tryfile404} = targetConfig

  const navigate = useNavigate();
  const {data, loading} = useApiRequest(() => staticResourcesDetails(id));

  const staticResourcesEl = (
    <>
      {loading && <Spinner/>}
      {!loading && (
        <span
          className={"underline underline-offset-2 cursor-pointer"}
          onClick={() => navigate(`/manage/static-resources/${id}/files`)}
        >
          {data?.name}
        </span>
      )}
    </>
  )

  return (
    <HoverCard>
      <HoverCardTrigger>
        <div>关联静态资源：{staticResourcesEl}</div>
      </HoverCardTrigger>
      <HoverCardContent>
        <div className={"text-base font-bold mb-2"}>目标地址：</div>
        <div className={"flex flex-col gap-1"}>
          <div>关联静态资源：{staticResourcesEl}</div>
          <div>首页：{index}</div>
          <div>404时使用指定页面返回：{tryfile404 || "无"}</div>
        </div>
      </HoverCardContent>
    </HoverCard>
  )
}

function RouteUrlsTargetConfigColumn(
  {
    targetConfig
  }: { targetConfig: RouteUrlsTargetConfigSchemaValues }) {
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
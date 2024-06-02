import {AppRouteInput, AppRouteListInput, AppRouteOutput, AppRouteStatusEnum} from "@/constant/api/app-routes/types.ts";
import {Get, Patch, PostJson, PutJson} from "@/constant/api";
import {
  appRouteListPageRecordsSchema,
  AppRouteListPageRecordsValues,
  appRouteOutputSchema
} from "@/constant/api/app-routes/schema.ts";

/**
 * 创建应用路由
 * @param input
 */
export function createAppRoute(input: AppRouteInput): Promise<AppRouteOutput> {
  return PostJson(`/api/app-route`, {body: input, resultSchema: appRouteOutputSchema});
}

/**
 * 应用路由列表
 * @param input
 */
export function appRouteList(input?: AppRouteListInput): Promise<AppRouteListPageRecordsValues> {
  return Get(`/api/app-route`, {body: input, resultSchema: appRouteListPageRecordsSchema})
}

/**
 * 应用路由详情
 * @param id
 */
export function appRouteDetails(id: number): Promise<AppRouteOutput> {
  return Get(`/api/app-route/${id}`, {resultSchema: appRouteOutputSchema});
}

/**
 * 更新应用路由
 * @param id
 * @param input
 */
export function updateAppRoute(id: number, input: AppRouteInput): Promise<AppRouteOutput> {
  return PutJson(`/api/app-route/${id}`, {body: input, resultSchema: appRouteOutputSchema});
}

/**
 * 更新应用路由状态
 * @param id
 * @param status
 */
export function setAppRouteStatus(id: number, status: AppRouteStatusEnum): Promise<AppRouteOutput> {
  return Patch(`/api/app-route/${id}/status/${status}`, {resultSchema: appRouteOutputSchema});
}
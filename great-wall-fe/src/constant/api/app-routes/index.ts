import {AppRouteInput, AppRouteListInput, AppRouteOutput} from "@/constant/api/app-routes/types.ts";
import {Get, PostJson, PutJson} from "@/constant/api";
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
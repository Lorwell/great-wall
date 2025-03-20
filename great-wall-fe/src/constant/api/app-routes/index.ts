import {AppRouteInput, AppRouteListInput, AppRouteOutput, AppRouteStatusEnum} from "@/constant/api/app-routes/types.ts";
import {
  appRouteOutputSchema,
  appRoutePageRecordsSchema,
  AppRoutePageRecordsValues, BatchDeleteAppRouteValues
} from "@/constant/api/app-routes/schema.ts";
import {deleteJsonRequest, getRequest, patchRequest, postJsonRequest, putJsonRequest} from "@/constant/api";

/**
 * 创建应用路由
 * @param input
 */
export function createAppRoute(input: AppRouteInput): Promise<AppRouteOutput> {
  return postJsonRequest(`/api/app-route`, {body: input, resultSchema: appRouteOutputSchema});
}

/**
 * 应用路由列表
 * @param input
 */
export function appRouteList(input?: AppRouteListInput): Promise<AppRoutePageRecordsValues> {
  return postJsonRequest(`/api/app-route/list`, {body: input, resultSchema: appRoutePageRecordsSchema})
}

/**
 * 应用路由详情
 * @param id
 */
export function appRouteDetails(id: number): Promise<AppRouteOutput> {
  return getRequest(`/api/app-route/${id}`, {resultSchema: appRouteOutputSchema});
}

/**
 * 更新应用路由
 * @param id
 * @param input
 */
export function updateAppRoute(id: number, input: AppRouteInput): Promise<AppRouteOutput> {
  return putJsonRequest(`/api/app-route/${id}`, {body: input, resultSchema: appRouteOutputSchema});
}

/**
 * 更新应用路由状态
 * @param id
 * @param status
 */
export function updateAppRouteStatus(id: number, status: AppRouteStatusEnum): Promise<AppRouteOutput> {
  return patchRequest(`/api/app-route/${id}/status/${status}`, {resultSchema: appRouteOutputSchema});
}

/**
 * 批量删除应用路由
 */
export function batchDeleteAppRoute(input: BatchDeleteAppRouteValues) {
  return deleteJsonRequest(`/api/app-route`, {body: input});
}
import {AppRouteInput, AppRouteOutput} from "@/constant/api/app-routes/types.ts";
import {PostJson} from "@/constant/api";

/**
 * 创建应用路由
 * @param input
 */
export function createAppRoute(input: AppRouteInput): Promise<AppRouteOutput> {
  return PostJson(`/api/app-route`, {body: input})
}
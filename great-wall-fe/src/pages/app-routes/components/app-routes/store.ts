import {atom} from "recoil";
import {AppRoutesDataOptions} from "@/pages/app-routes/components/app-routes/schema.ts";
import {RouteFilterEnum} from "@/constant/api/app-routes/types.ts";

/**
 * 应用路由数据选项
 */
export const appRoutesDataOptionsState = atom<AppRoutesDataOptions>({
  key: "appRoutesDataOptions",
  default: {
    filters: [{type: RouteFilterEnum.PreserveHostHeader, preserve: true}]
  },
});
import {z} from "zod";
import {createContext} from "react";
import {AppRouteStatusEnum} from "@/constant/api/app-routes/types.ts";


export interface AppRoutesDataOptions {

  /**
   * 基础信息
   */
  baseInfo?: Partial<BaseInfoFormValues>
}

export interface AppRoutesOptions extends AppRoutesDataOptions {

  /**
   * 设置基础信息
   * @param data
   */
  setBaseInfo?: (data: Partial<BaseInfoFormValues>) => void

}

export const AppRoutesContext = createContext<AppRoutesOptions>({});

// 基础信息
export const baseInfoFormSchema = z.object({
  name: z.string({required_error: "不可以为空"})
    .min(2, {
      message: "名称不能少于2个字符",
    })
    .max(30, {
      message: "名称不能超过30个字符",
    }),
  describe: z.string()
    .max(150, {
      message: "名称不能超过150个字符",
    })
    .optional(),
  priority: z.number({required_error: "不可以为空"}),
  status: z.enum(
    [AppRouteStatusEnum.DRAFT, AppRouteStatusEnum.ONLINE, AppRouteStatusEnum.OFFLINE],
    {required_error: "不可以为空"}
  ),
})

export type BaseInfoFormValues = z.infer<typeof baseInfoFormSchema>

// 路由条件
export const predicatesFormSchema = z.object({
  urls: z
    .array(
      z.object({
        value: z.string().url({message: "请输入有效地址"}),
      })
    )

})

export type PredicatesFormValues = z.infer<typeof predicatesFormSchema>
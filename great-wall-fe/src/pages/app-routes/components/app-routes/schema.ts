import {z} from "zod";
import {createContext} from "react";
import {AppRouteStatusEnum, PredicateTypeEnum, RoutePredicateOperatorEnum} from "@/constant/api/app-routes/types.ts";


export interface AppRoutesDataOptions {

  /**
   * 基础信息
   */
  baseInfo?: Partial<BaseInfoFormValues>

  /**
   * 路由条件
   */
  predicates?: Partial<PredicatesFormValues>

}

export interface AppRoutesOptions extends AppRoutesDataOptions {

  /**
   * 设置基础信息
   * @param data
   */
  setBaseInfo?: (data: Partial<BaseInfoFormValues>) => void

  /**
   * 设置路由条件
   * @param data
   */
  setPredicates?: (data: Partial<PredicatesFormValues>) => void

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

// -------------------------- 路由条件

export const cookiePredicatesSchema = z.object({
  type: z.enum([PredicateTypeEnum.Cookie]),
  name: z.string({required_error: "不可以为空"}),
  regexp: z.string({required_error: "不可以为空"}),
})
export type CookiePredicatesFormValues = z.infer<typeof cookiePredicatesSchema>

export const headerPredicatesSchema = z.object({
  type: z.enum([PredicateTypeEnum.Header]),
  name: z.string({required_error: "不可以为空"}),
  regexp: z.string({required_error: "不可以为空"}),
})
export type HeaderPredicatesFormValues = z.infer<typeof headerPredicatesSchema>

export const queryParamPredicatesSchema = z.object({
  type: z.enum([PredicateTypeEnum.Query]),
  name: z.string({required_error: "不可以为空"}),
  regexp: z.string({required_error: "不可以为空"}),
})
export type QueryParamPredicatesFormValues = z.infer<typeof queryParamPredicatesSchema>

export const hostPredicatesSchema = z.object({
  type: z.enum([PredicateTypeEnum.Host]),
  value: z.string({required_error: "不可以为空"})
})
export type HostPredicatesFormValues = z.infer<typeof hostPredicatesSchema>

export const methodPredicatesSchema = z.object({
  type: z.enum([PredicateTypeEnum.Method]),
  value: z.string({required_error: "不可以为空"})
})
export type MethodPredicatesFormValues = z.infer<typeof methodPredicatesSchema>

export const pathPredicatesSchema = z.object({
  type: z.enum([PredicateTypeEnum.Path]),
  patterns: z.array(z.string({required_error: "不可以为空"})),
  matchTrailingSlash: z.boolean({required_error: "不可以为空"}),
})
export type PathPredicatesFormValues = z.infer<typeof pathPredicatesSchema>

export const remoteAddrPredicatesSchema = z.object({
  type: z.enum([PredicateTypeEnum.RemoteAddr]),
  value: z.array(z.string({required_error: "不可以为空"}))
})

export type RemoteAddrPredicatesFormValues = z.infer<typeof remoteAddrPredicatesSchema>

export const predicatesSchema =z.union([cookiePredicatesSchema, headerPredicatesSchema, queryParamPredicatesSchema, hostPredicatesSchema, methodPredicatesSchema, pathPredicatesSchema, remoteAddrPredicatesSchema]);
export type PredicatesSchemaValues = z.infer<typeof predicatesSchema>

export const predicatesOperatorSchema = z.object({
  operator: z.enum([RoutePredicateOperatorEnum.AND, RoutePredicateOperatorEnum.OR]),
  predicate: z.union([cookiePredicatesSchema, headerPredicatesSchema, queryParamPredicatesSchema, hostPredicatesSchema, methodPredicatesSchema, pathPredicatesSchema, remoteAddrPredicatesSchema])
})
export type PredicatesOperatorSchemaValues = z.infer<typeof predicatesOperatorSchema>

export const predicatesFormSchema = z.object({
  predicates: z.array(predicatesOperatorSchema),
  urls: z.array(
    z.object({
      url: z.string({required_error: "不可以为空"}).url({message: "请输入有效地址"}),
      weight: z.number({required_error: "不可以为空"}).min(0, "权重最小值为0"),
    })
  ),

})

export type PredicatesFormValues = z.infer<typeof predicatesFormSchema>
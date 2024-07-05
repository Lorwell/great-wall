import {z} from "zod";
import {AppRouteStatusEnum, PredicateTypeEnum, RoutePredicateOperatorEnum} from "@/constant/api/app-routes/types.ts";
import {baseOutputSchema, getPageRecordSchema} from "@/constant/api/schema.ts";

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
    .optional()
    .nullable(),
  priority: z.number({required_error: "不可以为空"}),
  status: z.enum(
    [AppRouteStatusEnum.ONLINE, AppRouteStatusEnum.OFFLINE],
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
export type CookiePredicatesSchemaValues = z.infer<typeof cookiePredicatesSchema>

export const headerPredicatesSchema = z.object({
  type: z.enum([PredicateTypeEnum.Header]),
  name: z.string({required_error: "不可以为空"}),
  regexp: z.string({required_error: "不可以为空"}),
})
export type HeaderPredicatesSchemaValues = z.infer<typeof headerPredicatesSchema>

export const queryParamPredicatesSchema = z.object({
  type: z.enum([PredicateTypeEnum.Query]),
  name: z.string({required_error: "不可以为空"}),
  regexp: z.string({required_error: "不可以为空"}),
})
export type QueryPredicatesSchemaValues = z.infer<typeof queryParamPredicatesSchema>

export const hostPredicatesSchema = z.object({
  type: z.enum([PredicateTypeEnum.Host]),
  patterns: z.array(
    z.string({required_error: "不可以为空"}),
    {required_error: "不可以为空"}
  ).min(1, "不可以为空")
})

export type HostPredicatesSchemaValues = z.infer<typeof hostPredicatesSchema>

export const methodPredicatesSchema = z.object({
  type: z.enum([PredicateTypeEnum.Method]),
  methods: z.array(z.string({required_error: "不可以为空"}), {required_error: "不可以为空"})
})
export type MethodPredicatesSchemaValues = z.infer<typeof methodPredicatesSchema>

export const pathPredicatesSchema = z.object({
  type: z.enum([PredicateTypeEnum.Path]),
  patterns: z.array(z.string({required_error: "不可以为空"}), {required_error: "不可以为空"}),
  matchTrailingSlash: z.boolean({required_error: "不可以为空"}),
})
export type PathPredicatesSchemaValues = z.infer<typeof pathPredicatesSchema>

export const remoteAddrPredicatesSchema = z.object({
  type: z.enum([PredicateTypeEnum.RemoteAddr]),
  sources: z.array(z.string({required_error: "不可以为空"}), {required_error: "不可以为空"}),
})
export type RemoteAddrPredicatesSchemaValues = z.infer<typeof remoteAddrPredicatesSchema>

export const predicatesSchema = z.union([
  cookiePredicatesSchema,
  headerPredicatesSchema,
  queryParamPredicatesSchema,
  hostPredicatesSchema,
  methodPredicatesSchema,
  pathPredicatesSchema,
  remoteAddrPredicatesSchema
]);
export type PredicatesSchemaValues = z.infer<typeof predicatesSchema>

export const predicatesOperatorSchema = z.object({
  operator: z.enum([RoutePredicateOperatorEnum.AND, RoutePredicateOperatorEnum.OR]),
  predicate: predicatesSchema
})
export type PredicatesOperatorSchemaValues = z.infer<typeof predicatesOperatorSchema>

export const urlsSchema = z.object({
  url: z.string({required_error: "不可以为空"}).url({message: "请输入有效地址"}),
  weight: z.number({required_error: "不可以为空"})
    .min(1, "权重最小值为1")
    .max(100, "权重最大值为100"),
})
export type UrlsSchemaValues = z.infer<typeof urlsSchema>

export const targetConfigSchema = z.object({
  connectTimeout: z.string({required_error: "不可以为空"}),
  responseTimeout: z.string().optional(),
  urls: z.array(urlsSchema),
})
export type TargetConfigSchemaValues = z.infer<typeof targetConfigSchema>

export const predicates = z.array(predicatesOperatorSchema);
export type PredicatesValues = z.infer<typeof predicates>

export const predicatesFormSchema = z.object({
  predicates: predicates,
  targetConfig: targetConfigSchema
})

export type PredicatesFormValues = z.infer<typeof predicatesFormSchema>

// -------------------------- 插件配置


// -------------------------- 配置结果集

export const appRoutesConfSchema = baseInfoFormSchema.merge(predicatesFormSchema)
export type AppRoutesConfValues = z.infer<typeof appRoutesConfSchema>


export const appRouteOutputSchema = appRoutesConfSchema.merge(baseOutputSchema)
export type AppRouteOutputValues = z.infer<typeof appRouteOutputSchema>

export const appRoutePageRecordsSchema = getPageRecordSchema(appRouteOutputSchema)
export type AppRoutePageRecordsValues = z.infer<typeof appRoutePageRecordsSchema>
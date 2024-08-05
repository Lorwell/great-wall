import {z} from "zod";
import {
  AppRouteStatusEnum,
  PredicateTypeEnum,
  RouteFilterEnum,
  RoutePredicateOperatorEnum
} from "@/constant/api/app-routes/types.ts";
import {baseOutputSchema, getPageRecordSchema, nameValueSchema, valueSchema} from "@/constant/api/schema.ts";

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
  priority: z.coerce.number({invalid_type_error: "不可以为空", required_error: "不可以为空"}),
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
  weight: z.coerce.number({required_error: "不可以为空"})
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

export const basicAuthFilterSchema = z.object({
  type: z.enum([RouteFilterEnum.BasicAuth]),
  username: z.string({required_error: "不可以为空"}),
  password: z.string({required_error: "不可以为空"}),
})
export type BasicAuthFilterSchemaValues = z.infer<typeof basicAuthFilterSchema>

export const tokenBucketFilterSchema = z.object({
  type: z.enum([RouteFilterEnum.TokenBucketRequestRateLimiter]),
  limit: z.coerce.number({invalid_type_error: "无效的内容", required_error: "不可以为空"})
    .min(1, "最小值为1"),
  statusCode: z.coerce.number({invalid_type_error: "无效的内容", required_error: "不可以为空"})
    .min(100, "最小值为100")
    .max(999, "最大值为999"),
})
export type TokenBucketFilterSchemaValues = z.infer<typeof tokenBucketFilterSchema>

export const preserveHostHeaderFilterSchema = z.object({
  type: z.enum([RouteFilterEnum.PreserveHostHeader]),
  preserve: z.boolean({invalid_type_error: "无效的内容", required_error: "不可以为空"})
})
export type PreserveHostHeaderFilterSchemaValues = z.infer<typeof preserveHostHeaderFilterSchema>

export const addRequestHeadersFilterSchema = z.object({
  type: z.enum([RouteFilterEnum.AddRequestHeaders]),
  headers: z.array(nameValueSchema)
})
export type AddRequestHeadersFilterSchemaValues = z.infer<typeof addRequestHeadersFilterSchema>

export const addRequestQueryParametersFilterSchema = z.object({
  type: z.enum([RouteFilterEnum.AddRequestQueryParameters]),
  params: z.array(nameValueSchema)
})
export type AddRequestQueryParametersFilterSchemaValues = z.infer<typeof addRequestQueryParametersFilterSchema>

export const addResponseHeadersFilterSchema = z.object({
  type: z.enum([RouteFilterEnum.AddResponseHeaders]),
  headers: z.array(nameValueSchema)
})
export type AddResponseHeadersFilterSchemaValues = z.infer<typeof addResponseHeadersFilterSchema>

export const removeRequestHeadersFilterSchema = z.object({
  type: z.enum([RouteFilterEnum.RemoveRequestHeaders]),
  headerNames: z.array(valueSchema)
})
export type RemoveRequestHeadersFilterSchemaValues = z.infer<typeof removeRequestHeadersFilterSchema>

export const removeResponseHeadersFilterSchema = z.object({
  type: z.enum([RouteFilterEnum.RemoveResponseHeaders]),
  headerNames: z.array(valueSchema)
})
export type RemoveResponseHeadersFilterSchemaValues = z.infer<typeof removeResponseHeadersFilterSchema>

export const removeRequestQueryParametersFilterSchema = z.object({
  type: z.enum([RouteFilterEnum.RemoveRequestQueryParameters]),
  paramNames: z.array(valueSchema)
})
export type RemoveRequestQueryParametersFilterSchemaValues = z.infer<typeof removeRequestQueryParametersFilterSchema>

export const filterSchema = z.union([
  basicAuthFilterSchema,
  tokenBucketFilterSchema,
  preserveHostHeaderFilterSchema,
  addRequestHeadersFilterSchema,
  addRequestQueryParametersFilterSchema,
  addResponseHeadersFilterSchema,
  removeRequestHeadersFilterSchema,
  removeResponseHeadersFilterSchema,
  removeRequestQueryParametersFilterSchema
]);


export type FilterFormValues = z.infer<typeof filterSchema>
export const filtersSchema = z.array(filterSchema)
export type FiltersFormValues = z.infer<typeof filtersSchema>


// -------------------------- 配置结果集

export const appRoutesConfSchema =
  z.object({
    filters: filtersSchema
  })
    .merge(baseInfoFormSchema)
    .merge(predicatesFormSchema)

export type AppRoutesConfValues = z.infer<typeof appRoutesConfSchema>


export const appRouteOutputSchema = appRoutesConfSchema.merge(baseOutputSchema)
export type AppRouteOutputValues = z.infer<typeof appRouteOutputSchema>

export const appRoutePageRecordsSchema = getPageRecordSchema(appRouteOutputSchema)
export type AppRoutePageRecordsValues = z.infer<typeof appRoutePageRecordsSchema>
import {AppRouteOutputValues, AppRoutesConfValues} from "@/constant/api/app-routes/schema.ts";
import {BaseListInputSchemaValues} from "@/constant/api/schema.ts";

export enum AppRouteStatusEnum {

  /**
   * 上线
   */
  ONLINE = "ONLINE",

  /**
   * 下线
   */
  OFFLINE = "OFFLINE"

}

export enum RoutePredicateOperatorEnum {

  AND = "AND", OR = "OR"

}

export enum PredicateTypeEnum {

  /**
   * Cookie
   */
  Cookie = "Cookie",

  /**
   * Header
   */
  Header = "Header",

  /**
   * Host
   */
  Host = "Host",

  /**
   * Method
   */
  Method = "Method",

  /**
   * Path
   */
  Path = "Path",

  /**
   * Query
   */
  Query = "Query",

  /**
   * RemoteAddr
   */
  RemoteAddr = "RemoteAddr"

}

export enum RouteFilterEnum {


  /* ------------------------  身份认证 ------------------------------- */

  /**
   * RFC 7235 HTTP 身份验证，服务器可以用来质询（challenge）客户端的请求，客户端则可以提供身份验证凭据。
   */
  BasicAuth = "BasicAuth",


  /* ------------------------  安全防护 ------------------------------- */


  /* ------------------------  流量控制 ------------------------------- */

  /**
   * 令牌桶算法流量空值
   */
  TokenBucketRequestRateLimiter = "TokenBucketRequestRateLimiter",


  /* ------------------------  请求修改 ------------------------------- */

  /**
   * 是否保留 Host 请求头
   */
  PreserveHostHeader = "PreserveHostHeader",

  /**
   * 添加请求标头
   */
  AddRequestHeaders = "AddRequestHeaders",

  /**
   * 添加查询参数
   */
  AddRequestQueryParameters = "AddRequestQueryParameters",

  /**
   * 添加响应标头
   */
  AddResponseHeaders = "AddResponseHeaders",

  /**
   * 删除请求标头
   */
  RemoveRequestHeaders = "RemoveRequestHeaders",

  /**
   * 删除查询参数
   */
  RemoveRequestQueryParameters = "RemoveRequestQueryParameters",

  /**
   * 删除响应标头
   */
  RemoveResponseHeaders = "RemoveResponseHeaders",

}

export type AppRouteInput = Partial<AppRoutesConfValues>
export type AppRouteOutput = Partial<AppRouteOutputValues>
export type AppRouteListOutput = AppRouteOutput

export interface AppRouteListInput extends BaseListInputSchemaValues {

  /**
   * 状态匹配
   */
  status?: AppRouteStatusEnum
}
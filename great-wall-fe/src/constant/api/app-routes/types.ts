import {AppRoutesConfValues} from "@/constant/api/app-routes/schema.ts";
import {BaseOutputSchemaValues} from "@/constant/api/schema.ts";

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

export type AppRouteInput = Partial<AppRoutesConfValues>
export type AppRouteOutput = Partial<AppRoutesConfValues> & Partial<BaseOutputSchemaValues>


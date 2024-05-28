export enum AppRouteStatusEnum {

  /**
   * 上线
   */
  ONLINE = "ONLINE",

  /**
   * 下线
   */
  OFFLINE = "OFFLINE",

  /**
   * 草稿状态
   */
  DRAFT = "DRAFT"

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
  RemoteAddr = "RemoteAddr",

  /**
   * Weight
   */
  Weight = "Weight"


}
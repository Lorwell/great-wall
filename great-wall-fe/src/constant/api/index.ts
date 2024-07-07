import _ from "lodash";
import {isBlank} from "@/utils/Utils";
import {errorMsgSchema, ErrorMsgValues, fieldsErrorSchema} from "@/constant/api/schema.ts";
import {ZodTypeAny} from "zod";
import queryString from "query-string";

/**
 * 发送 fetch 请求
 */
const fetchRequest = (uri: string, init?: RequestInit) => {
  return fetch(uri, init);
};

/**
 * Get 请求
 * @param uri 请求地址
 * @param queryParam 查询参数
 * @param headers 请求头
 * @param resultSchema 结构值结构
 * @constructor
 */
export const Get = <T>(uri: string, {queryParam, headers, resultSchema}: RequestParam = {}): Promise<T> => {
  return fetchResultHandle(() => {
    return fetchRequest(uriQueryParamJoint(uri, queryParam),
      {
        method: "GET",
        headers: {
          ...headers,
          "Accept": "application/json;charset=utf-8"
        }
      });
  }, resultSchema);
};


/**
 * Post 表单请求
 * @param uri 请求地址
 * @param queryParam 查询参数
 * @param body 参数
 * @param headers 请求头
 * @param resultSchema 结构值结构
 * @constructor
 */
export const Post = <T>(uri: string, {queryParam, body, headers, resultSchema}: RequestParam = {}): Promise<T> => {
  return fetchResultHandle(() => {
    return fetchRequest(uriQueryParamJoint(uri, queryParam),
      {
        method: "POST",
        headers: {
          ...headers,
          "Accept": "application/json;charset=utf-8",
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        body: body && Object.keys(body).length > 0 ? queryParamJoint(body) : null
      });
  }, resultSchema);
};


/**
 * Post 多部份表单请求
 * @param uri 请求地址
 * @param queryParam 查询参数
 * @param body 参数
 * @param headers 请求头
 * @param resultSchema 结构值结构
 * @constructor
 */
export const PostFormData = <T>(uri: string, {
  queryParam,
  body,
  headers,
  resultSchema
}: RequestParam = {}): Promise<T> => {
  const formData = new FormData();

  if (body && Object.keys(body).length > 0) {
    for (let key of Object.keys(body)) {
      const value = body[key];
      formData.set(key, value)
    }
  }

  return fetchResultHandle(() => {
    return fetchRequest(uriQueryParamJoint(uri, queryParam),
      {
        method: "POST",
        headers: {
          ...headers,
          "Accept": "application/json;charset=utf-8",
        },
        body: formData,
      });
  }, resultSchema);
};


/**
 * Post json请求
 * @param uri 请求地址
 * @param queryParam 查询参数
 * @param body 参数
 * @param headers 请求头
 * @param resultSchema 结构值结构
 * @constructor
 */
export const PostJson = <T>(uri: string, {queryParam, body, headers, resultSchema}: RequestParam = {}): Promise<T> => {
  return fetchResultHandle(() => {
    return fetchRequest(uriQueryParamJoint(uri, queryParam),
      {
        method: "POST",
        headers: {
          ...headers,
          "Accept": "application/json;charset=utf-8",
          "Content-Type": "application/json;charset=utf-8"
        },
        body: body && Object.keys(body).length > 0 ? JSON.stringify(body) : null
      });
  }, resultSchema);
};

/**
 * Put json请求
 * @param uri 请求地址
 * @param queryParam 查询参数
 * @param body 参数
 * @param headers 请求头
 * @param resultSchema 结构值结构
 * @constructor
 */
export const PutJson = <T>(uri: string, {queryParam, body, headers, resultSchema}: RequestParam = {}): Promise<T> => {
  return fetchResultHandle(() => {
    return fetchRequest(uriQueryParamJoint(uri, queryParam),
      {
        method: "PUT",
        headers: {
          ...headers,
          "Accept": "application/json;charset=utf-8",
          "Content-Type": "application/json;charset=utf-8"
        },
        body: body && Object.keys(body).length > 0 ? JSON.stringify(body) : null
      });
  }, resultSchema);
};

/**
 * Patch 表单请求
 * @param uri 请求地址
 * @param queryParam 查询参数
 * @param body 参数
 * @param headers 请求头
 * @param resultSchema 结构值结构
 * @constructor
 */
export const Patch = <T>(uri: string, {queryParam, body, headers, resultSchema}: RequestParam = {}): Promise<T> => {
  return fetchResultHandle(() => {
    return fetchRequest(uriQueryParamJoint(uri, queryParam),
      {
        method: "PATCH",
        headers: {
          ...headers,
          "Accept": "application/json;charset=utf-8",
          "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
        },
        body: body && Object.keys(body).length > 0 ? queryParamJoint(body) : null
      });
  }, resultSchema);
};


/**
 * patch json请求
 * @param uri 请求地址
 * @param queryParam 查询参数
 * @param body 参数
 * @param headers 请求头
 * @param resultSchema 结构值结构
 * @constructor
 */
export const PatchJson = <T>(uri: string, {queryParam, body, headers, resultSchema}: RequestParam = {}): Promise<T> => {
  return fetchResultHandle(() => {
    return fetchRequest(uriQueryParamJoint(uri, queryParam),
      {
        method: "PATCH",
        headers: {
          ...headers,
          "Accept": "application/json;charset=utf-8",
          "Content-Type": "application/json;charset=utf-8"
        },
        body: body && Object.keys(body).length > 0 ? JSON.stringify(body) : null
      });
  }, resultSchema);
};


/**
 * DeleteJson 请求
 * @param uri 请求地址
 * @param queryParam 查询参数
 * @param body 请求头
 * @param headers 请求头
 * @param resultSchema 结构值结构
 * @constructor
 */
export const DeleteJson = <T>(uri: string, {
  queryParam,
  body,
  headers,
  resultSchema
}: RequestParam = {}): Promise<T> => {
  return fetchResultHandle(() => {
    return fetchRequest(uriQueryParamJoint(uri, queryParam),
      {
        method: "DELETE",
        headers: {
          ...headers,
          "Accept": "application/json;charset=utf-8",
          "Content-Type": "application/json;charset=utf-8"
        },
        body: body && Object.keys(body).length > 0 ? JSON.stringify(body) : null
      });
  }, resultSchema);
};

export interface RequestParam {

  /**
   * 查询参数
   */
  queryParam?: Record<string, any | Array<any>>

  /**
   * 头部参数
   */
  headers?: HeadersInit

  /**
   * 请求体
   */
  body?: Record<string, any>

  /**
   * 响应值结构
   */
  resultSchema?: ZodTypeAny
}

/**
 * http 请求异常
 */
export class HttpException extends Error {
  url: string;
  status: number;
  statusText: string;
  body: Partial<ErrorMsgValues> | any;

  constructor(url: string,
              status: number,
              statusText: string,
              body: Partial<ErrorMsgValues> | any,
              message?: string) {
    super(`请求 ${url} 发生错误,响应: ${status} - ${statusText}${message ? `：${message}` : JSON.stringify(body)}`);
    this.url = url;
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }

}

/**
 * fetch 结果处理器
 * @param service 服务请求函数
 * @param resultSchema 结果值结构
 */
const fetchResultHandle = async <T>(service: () => Promise<Response>, resultSchema?: ZodTypeAny): Promise<T> => {
  const response = await service();
  const {headers, status, statusText, url} = response
  const success = status >= 200 && status <= 300;

  let body;

  // JSON 结果解析
  const contentType = headers.get("content-Type");
  const length = Number(headers.get("content-length"));

  if (length === 0) {
    body = null;
  } else if (contentType && contentType.includes("application/json")) {
    body = await response.json();
  } else {
    body = await response.text()

    if (isBlank(body)) {
      body = undefined
    } else {
      try {
        body = JSON.parse(body)
      } catch (e) {
        if (success) {
          throw new HttpException(url, status, statusText,
            {
              code: "response.contentType-type.invalid",
              message: `不支持响应类型解析：${contentType}, 响应值：${body}`
            },
            `不支持响应类型解析：${contentType}, 响应值：${body}`);
        }
      }
    }
  }

  // 请求成功
  if (success) {
    try {
      return (!!body && resultSchema?.parse(body)) || body
    } catch (e) {
      console.log(`结果值结构解析失败!`, e)
      body = {
        code: "response.invalid",
        message: `结果值结构解析失败：${e}`
      }
      throw new HttpException(url, status, statusText, body, `结果值结构解析失败：${e}`);
    }
  }

  try {
    if (status === 422) {
      body = fieldsErrorSchema.parse(body);
    } else {
      body = errorMsgSchema.parse(body)
    }
  } catch (e) {
    body = {
      code: "response.invalid",
      message: `未知的响应值：${body}`
    }
  }

  throw new HttpException(url, status, statusText, body);
};

/**
 * 查询参数拼接，使用 = 组合查询参数的key和value，使用 & 连接不同组的查询参数
 * @param uri 请求地址
 * @param queryParam 查询参数对象
 */
export const uriQueryParamJoint = (uri: string, queryParam?: Record<string, any | Array<any>>): string => {
  const params = new Array<string>();

  // 如果 uri 上带了查询参数
  const i = uri.indexOf("?");
  if (i > 0) {
    const param = uri.substring(i + 1, uri.length);
    for (let str of _.split(param, "&")) {
      params.push(str);
    }
    uri = uri.substring(0, i);
  }

  if (params.length > 0) {
    uri = uri + "?" + params.join("&");
  }

  if (queryParam && Object.keys(queryParam).length > 0) {
    uri = uri + (params.length > 0 ? "&" : "?") + queryParamJoint(queryParam);
  }

  return uri;
};
/**
 * 查询参数拼接，使用 = 组合查询参数的key和value，使用 & 连接不同组的查询参数
 * @param queryParam 查询参数对象
 */
export const queryParamJoint = (queryParam?: Record<string, any | Array<any>>): string => {
  return !!queryParam ? queryString.stringify(queryParam) : ""
  // const params = new Array<string>();
  //
  // // 拼接参数
  // if (queryParam && Object.keys(queryParam).length > 0) {
  //   for (let queryParamKey in queryParam) {
  //     if (queryParam.hasOwnProperty(queryParamKey)) {
  //       const valObj = queryParam[queryParamKey];
  //       if (valObj == null) continue; // 过滤空值
  //
  //       if (valObj instanceof Array) {
  //         for (let val of valObj) {
  //           if (val == null) continue; // 过滤空值
  //           params.push(`${queryParamKey}=${encodeURIComponent(String(val))}`);
  //         }
  //       } else {
  //         params.push(`${queryParamKey}=${encodeURIComponent(String(valObj))}`);
  //       }
  //     }
  //   }
  // }
  //
  // return params.join("&");
};

import _ from "lodash";
import {isBlank} from "@/utils/Utils";

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
 * @constructor
 */
export const Get = <T>(uri: string, {queryParam, headers}: RequestParam = {}): Promise<T> => {
  return fetchResultHandle(() => {
    return fetchRequest(uriQueryParamJoint(uri, queryParam),
      {
        method: "GET",
        headers: {
          ...headers,
          "Accept": "application/json;charset=utf-8"
        }
      });
  });
};


/**
 * Post 表单请求
 * @param uri 请求地址
 * @param queryParam 查询参数
 * @param body 参数
 * @param headers 请求头
 * @constructor
 */
export const Post = <T>(uri: string, {queryParam, body, headers}: RequestParam = {}): Promise<T> => {
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
  });
};


/**
 * Post 多部份表单请求
 * @param uri 请求地址
 * @param queryParam 查询参数
 * @param body 参数
 * @param headers 请求头
 * @constructor
 */
export const PostFormData = <T>(uri: string, {queryParam, body, headers}: RequestParam = {}): Promise<T> => {
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
  });
};


/**
 * Post json请求
 * @param uri 请求地址
 * @param queryParam 查询参数
 * @param body 参数
 * @param headers 请求头
 * @constructor
 */
export const PostJson = <T>(uri: string, {queryParam, body, headers}: RequestParam = {}): Promise<T> => {
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
  });
};

/**
 * Put json请求
 * @param uri 请求地址
 * @param queryParam 查询参数
 * @param body 参数
 * @param headers 请求头
 * @constructor
 */
export const PutJson = <T>(uri: string, {queryParam, body, headers}: RequestParam = {}): Promise<T> => {
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
  });
};

/**
 * Patch 表单请求
 * @param uri 请求地址
 * @param queryParam 查询参数
 * @param body 参数
 * @param headers 请求头
 * @constructor
 */
export const Patch = <T>(uri: string, {queryParam, body, headers}: RequestParam = {}): Promise<T> => {
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
  });
};


/**
 * patch json请求
 * @param uri 请求地址
 * @param queryParam 查询参数
 * @param body 参数
 * @param headers 请求头
 * @constructor
 */
export const PatchJson = <T>(uri: string, {queryParam, body, headers}: RequestParam = {}): Promise<T> => {
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
  });
};


/**
 * DeleteJson 请求
 * @param uri 请求地址
 * @param queryParam 查询参数
 * @param headers 请求头
 * @constructor
 */
export const DeleteJson = <T>(uri: string, {queryParam, body, headers}: RequestParam = {}): Promise<T> => {
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
  });
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
}

/**
 * http 请求异常
 */
export class HttpException extends Error {
  url: string;
  status: number;
  statusText: string;
  body: ErrorMsg;

  constructor(url: string, status: number, statusText: string, body: ErrorMsg) {
    super(`请求 ${url} 发生错误,响应: ${status} - ${statusText}${!!body ? ", 主体: " + JSON.stringify(body) : ""}`);
    this.url = url;
    this.status = status;
    this.statusText = statusText;
    this.body = body;
  }

}

/**
 * fetch 结果处理器
 * @param service 服务请求函数
 */
const fetchResultHandle = async <T>(service: () => Promise<Response>): Promise<T> => {
  const response = await service();

  const status = response.status;
  const success = status >= 200 && status <= 300;

  let body;

  // JSON 结果解析
  const content = response.headers.get("content-Type");
  if (content && content.includes("application/json")) {
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
          throw new HttpException(response.url, status, response.statusText,
            {
              code: "response.content-type.invalid",
              message: `不支持响应类型解析：${content}, 响应值：${body}`
            });
        }
      }
    }
  }

  // 请求成功
  if (success) {
    return body;
  }

  throw new HttpException(response.url, status, response.statusText, body);
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
  const params = new Array<string>();

  // 拼接参数
  if (queryParam && Object.keys(queryParam).length > 0) {
    for (let queryParamKey in queryParam) {
      if (queryParam.hasOwnProperty(queryParamKey)) {
        const valObj = queryParam[queryParamKey];
        if (valObj == null) continue; // 过滤空值

        if (valObj instanceof Array) {
          for (let val of valObj) {
            if (val == null) continue; // 过滤空值
            params.push(`${queryParamKey}=${encodeURIComponent(String(val))}`);
          }
        } else {
          params.push(`${queryParamKey}=${encodeURIComponent(String(valObj))}`);
        }
      }
    }
  }

  return params.join("&");
};


export interface Msg {

  /**
   * 唯一码
   */
  code: string;

  /**
   * 消息
   */
  message: string;

}

export interface ErrorMsg extends Msg {

}

/**
 * 字段错误输出
 */
export interface FieldsError extends ErrorMsg {

  /**
   * 错误的字段
   */
  fields: Record<string, Array<FieldError>>;

}

export interface FieldError extends ErrorMsg {

  /**
   * 错误的字段值
   */
  rejectedValue?: any;

}


/**
 * 集合结果
 */
export interface Records<T> {

  records: Array<T>;

}

/**
 * 集合结果
 */
export interface PageRecords<T> extends Records<T> {

  /**
   * 分页信息
   */
  page: PageOutput;

}

export interface PageOutput {

  /**
   * 当前页码，从0开始
   */
  current: number;

  /**
   * 页长度
   */
  size: number;

  /**
   * 总量
   */
  total: number;

}

/**
 * 基础列表输入模型
 */
export interface BaseListInput {

  /**
   * 分页字段 当前页，从0开始
   * <p>
   * 默认为空，不分页
   */
  current?: number;

  /**
   * 分页字段 页长度
   */
  size?: number;

  /**
   * 排序字段名称
   */
  orderBy?: string | string[];

  /**
   * 排序方式
   */
  orderDirection?: Direction;

  /**
   * 排序空值处理
   */
  orderNullHandling?: NullHandling;

}

export enum NullHandling {

  /**
   * 默认处理
   */
  NATIVE = "NATIVE",

  /**
   * 提示所使用的数据存储以将具有空值的条目排在非空条目之前
   */
  NULLS_FIRST = "NULLS_FIRST",

  /**
   * 提示所使用的数据存储，以便将具有空值的条目排在非空条目之后
   */
  NULLS_LAST = "NULLS_LAST"
}

export enum Direction {

  ASC = "ASC",
  DESC = "DESC"
}

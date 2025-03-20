import {isBlank, removePrefix} from "@/lib/utils";
import {
  AiEvent,
  AiEventTypeEnum,
  errorMsgSchema,
  ErrorMsgValues,
  fieldsErrorSchema,
  ServerSentEvent
} from "./schema.ts";
import {ZodAnyDef, ZodType, ZodTypeAny} from "zod";
// @ts-ignore
import qs from "qs";
import Cookies from "js-cookie";
import {SITE_COOKIE_NAME} from "@/constant";

/**
 * 发送 fetch 请求
 */
const fetchRequest = (
  {
    uri,
    init,
    onAbortController
  }: {
    uri: string,
    init?: RequestInit,
    onAbortController?: OnAbortController
  }
) => {

  // url 路径
  // @ts-ignore
  let baseUrl: string = window.__baseUrl || `${window.location.protocol}//${window.location.host}`;
  if (baseUrl.endsWith("/")) {
    baseUrl = baseUrl.substring(0, baseUrl.length - 1);
  }
  uri = `${baseUrl}/${uri.startsWith("/") ? uri.substring(1, uri.length) : uri}`;

  // 中断控制器
  if (!!onAbortController) {

    const abortController = new AbortController()
    onAbortController?.(abortController)

    if (!init) {
      init = {}
    }

    init.signal = abortController.signal
  }

  return fetch(uri, init);
};

/**
 * Get 请求
 * @constructor
 */
export const getRequest = <T>(uri: string,
                              {
                                queryParam,
                                headers,
                                resultSchema,
                                onAbortController
                              }: RequestParam<T> = {}): Promise<T> => {
  return fetchResultHandle(() => {
    return fetchRequest({
      uri: uriQueryParamJoint(uri, queryParam),
      init: {
        method: "GET",
        headers: {
          ...headers,
          "Accept": "application/json;charset=utf-8"
        }
      },
      onAbortController: onAbortController
    });
  }, resultSchema);
};


/**
 * Post 表单请求
 * @constructor
 */
export const postRequest = <T>(uri: string,
                               {
                                 queryParam,
                                 body,
                                 headers,
                                 resultSchema,
                                 onAbortController
                               }: RequestParam<T> = {}): Promise<T> => {
  return fetchResultHandle(() => {
    return fetchRequest(
      {
        uri: uriQueryParamJoint(uri, queryParam),
        init: {
          method: "POST",
          headers: {
            ...headers,
            "Accept": "application/json;charset=utf-8",
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          body: body && Object.keys(body).length > 0 ? queryParamJoint(body) : null
        },
        onAbortController: onAbortController
      });
  }, resultSchema);
};


/**
 * Post 多部份表单请求
 * @constructor
 */
export const postFormDataRequest = <T>(uri: string,
                                       {
                                         queryParam,
                                         body,
                                         headers,
                                         resultSchema,
                                         onAbortController
                                       }: RequestParam<T> = {}): Promise<T> => {
  const formData = new FormData();

  if (body && Object.keys(body).length > 0) {
    for (let key of Object.keys(body)) {
      const value = body[key];
      formData.set(key, value)
    }
  }

  return fetchResultHandle(() => {
    return fetchRequest(
      {
        uri: uriQueryParamJoint(uri, queryParam),
        init: {
          method: "POST",
          headers: {
            ...headers,
            "Accept": "application/json;charset=utf-8",
          },
          body: formData,
        },
        onAbortController: onAbortController
      });
  }, resultSchema);
};


/**
 * Post json请求
 * @constructor
 */
export const postJsonRequest = <T>(uri: string,
                                   {
                                     queryParam,
                                     body,
                                     headers,
                                     resultSchema,
                                     onAbortController
                                   }: RequestParam<T> = {}): Promise<T> => {
  return fetchResultHandle(() => {
    return fetchRequest(
      {
        uri: uriQueryParamJoint(uri, queryParam),
        init: {
          method: "POST",
          headers: {
            ...headers,
            "Accept": "application/json;charset=utf-8",
            "Content-Type": "application/json;charset=utf-8"
          },
          body: body && Object.keys(body).length > 0 ? JSON.stringify(body) : null
        },
        onAbortController: onAbortController
      });
  }, resultSchema);
};

/**
 * Put json请求
 * @constructor
 */
export const putJsonRequest = <T>(uri: string,
                                  {
                                    queryParam,
                                    body,
                                    headers,
                                    resultSchema,
                                    onAbortController
                                  }: RequestParam<T> = {}): Promise<T> => {
  return fetchResultHandle(() => {
    return fetchRequest(
      {
        uri: uriQueryParamJoint(uri, queryParam),
        init: {
          method: "PUT",
          headers: {
            ...headers,
            "Accept": "application/json;charset=utf-8",
            "Content-Type": "application/json;charset=utf-8"
          },
          body: body && Object.keys(body).length > 0 ? JSON.stringify(body) : null
        },
        onAbortController: onAbortController
      });
  }, resultSchema);
};

/**
 * Patch 表单请求
 * @constructor
 */
export const patchRequest = <T>(uri: string,
                                {
                                  queryParam,
                                  body,
                                  headers,
                                  resultSchema,
                                  onAbortController
                                }: RequestParam<T> = {}): Promise<T> => {
  return fetchResultHandle(() => {
    return fetchRequest(
      {
        uri: uriQueryParamJoint(uri, queryParam),
        init: {
          method: "PATCH",
          headers: {
            ...headers,
            "Accept": "application/json;charset=utf-8",
            "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
          },
          body: body && Object.keys(body).length > 0 ? queryParamJoint(body) : null
        },
        onAbortController: onAbortController
      });
  }, resultSchema);
};


/**
 * patch json请求
 * @constructor
 */
export const patchJsonRequest = <T>(uri: string,
                                    {
                                      queryParam,
                                      body,
                                      headers,
                                      resultSchema,
                                      onAbortController
                                    }: RequestParam<T> = {}): Promise<T> => {
  return fetchResultHandle(() => {
    return fetchRequest(
      {
        uri: uriQueryParamJoint(uri, queryParam),
        init: {
          method: "PATCH",
          headers: {
            ...headers,
            "Accept": "application/json;charset=utf-8",
            "Content-Type": "application/json;charset=utf-8"
          },
          body: body && Object.keys(body).length > 0 ? JSON.stringify(body) : null
        },
        onAbortController: onAbortController
      });
  }, resultSchema);
};


/**
 * DeleteJson 请求
 * @constructor
 */
export const deleteJsonRequest = <T>(uri: string,
                                     {
                                       queryParam,
                                       body,
                                       headers,
                                       resultSchema,
                                       onAbortController
                                     }: RequestParam<T> = {}): Promise<T> => {
  return fetchResultHandle(() => {
    return fetchRequest(
      {
        uri: uriQueryParamJoint(uri, queryParam),
        init: {
          method: "DELETE",
          headers: {
            ...headers,
            "Accept": "application/json;charset=utf-8",
            "Content-Type": "application/json;charset=utf-8"
          },
          body: body && Object.keys(body).length > 0 ? JSON.stringify(body) : null,
        },
        onAbortController: onAbortController
      });
  }, resultSchema);
};

/**
 * sse 请求
 */
export const sseRequest = <T extends AiEvent>(
  uri: string,
  {
    method = "POST",
    queryParam,
    body,
    headers,
    resultSchema,
    onAbortController,
    onCompleted,
    onEvent,
    onError,
  }: RequestParam<T> & OtherOptions<T> & { method?: string; } = {},
) => {
  (async () => {
    try {
      const response = await fetchRequest(
        {
          uri: uriQueryParamJoint(uri, queryParam),
          init: {
            method: method,
            headers: {
              ...headers,
              "Accept": "text/event-stream;charset=utf-8",
              "Content-Type": "application/json;charset=utf-8"
            },
            body: body && Object.keys(body).length > 0 ? JSON.stringify(body) : null,
          },
          onAbortController: onAbortController
        }
      )

      // 错误的响应
      if (!response.ok) {
        const headers = response.headers;
        const contentType = headers.get("content-Type");
        const length = Number(headers.get("content-length"));

        let message: string | undefined;
        if (length === 0) {
          message = '内部服务错误！'
          await onError?.(message)
        } else if (contentType && contentType.includes("application/json")) {
          const data = await response.json();
          message = data?.message?.toString() || '内部服务错误！'
          // @ts-ignore
          await onError?.(message, data?.code)
        } else {
          const data = await response.text()
          message = data || '内部服务错误！'
          await onError?.(message)
        }

        await onCompleted?.(true, message)
        return
      }

      await handleStream(response, resultSchema, onCompleted, onEvent)
    } catch (e) {
      let message: string | undefined
      let code: string | undefined

      if (e instanceof SSEException) {
        message = e.message
        code = e.code
      } else if (e instanceof Error) {
        console.error(e)
        message = e.message
      } else {
        console.error(e)
        message = e?.toString() || "未知的错误"
      }

      if (!!onError) {
        await onError(message!, code)
      } else {
        console.error(e)
      }

      await onCompleted?.(true, message)
    }
  })()
}

/**
 * 处理流结果
 */
async function handleStream<T>(
  response: Response,
  resultSchema?: ZodType<T, ZodAnyDef, any>,
  onCompleted?: OnCompleted,
  onEvent?: OnEvent<T>,
) {
  if (!response.ok)
    throw new SSEException('内部服务错误')

  const reader = response.body?.getReader()
  const decoder = new TextDecoder('utf-8')
  let buffer = ''
  let isFirstMessage = true

  // 读取消息
  async function read() {
    const result = await reader?.read();
    if (!result) {
      await onCompleted?.(false)
      return
    }

    buffer += decoder.decode(result.value, {stream: true})

    const lines = buffer.split('\n')

    let arr = new Array<string>()
    for (let line of lines) {
      if (isBlank(line)) {

        if (arr.length !== 0) {
          const event: Partial<ServerSentEvent<T>> = {}
          for (let message of arr) {
            if (message.startsWith("id:")) {
              event.id = removePrefix(message, "id:")
            } else if (message.startsWith("event:")) {
              event.event = removePrefix(message, "event:") as AiEventTypeEnum
            } else if (message.startsWith("retry:")) {
              event.retry = Number(removePrefix(message, "retry:"))
            } else if (message.startsWith(":")) {
              event.comment = removePrefix(message, ":")
            } else if (message.startsWith("data:")) {
              const dataJson = JSON.parse(removePrefix(message, "data:"))

              try {
                event.data = resultSchema?.parse(dataJson)
              } catch (e) {
                throw new SSEException(`解析消息发送例外，消息无法使用 ${resultSchema} 解析器解析：${dataJson}`)
              }
              event.data = event.data || dataJson
            }
          }
          await onEvent?.(event as ServerSentEvent<T>, isFirstMessage)
          isFirstMessage = false
        }

        arr = new Array<string>()
      } else {
        arr.push(line)
      }
    }

    buffer = arr.join("\n")

    if (result.done) {
      await onCompleted?.(false)
      return
    }

    await read()
  }

  await read()
}

export type OnCompleted = (hasError: boolean, errorMessage?: string) => Promise<void> | void
export type OnEvent<T> = (event: ServerSentEvent<T>, isFirstMessage: boolean) => Promise<void> | void
export type OnError = (message: string, code?: string) => Promise<void> | void

export type OtherOptions<T> = {
  onCompleted?: OnCompleted,
  onEvent?: OnEvent<T>,
  onError?: OnError,
}

export type OnAbortController = (abortController: AbortController) => void

export interface RequestParam<T = any> {

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
  resultSchema?: ZodType<T, any, any>,

  /**
   * 中断控制器
   */
  onAbortController?: OnAbortController
}

/**
 * sse 请求异常
 */
export class SSEException extends Error {
  message: string
  code?: string;

  constructor(message: string, code?: string) {
    super(message)
    this.message = message;
    this.code = code;
  }
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

  let body: any = await response.text();

  // JSON 结果解析
  const contentType = headers.get("content-Type");

  if (contentType && contentType.includes("application/json")) {
    body = isBlank(body) ? null : JSON.parse(body);
  } else {
    if (!isBlank(body) && success) {
      throw new HttpException(url, status, statusText,
        {
          code: "response.contentType-type.invalid",
          message: `不支持响应类型解析：${contentType}, 响应值：${body}`
        },
        `不支持响应类型解析：${contentType}, 响应值：${body}`);
    }
  }

  // 请求成功
  if (success) {
    try {
      return (!!body && resultSchema?.parse(body)) || body
    } catch (e) {
      console.error(`结果值结构解析失败!`, e)
      body = {
        code: "response.invalid",
        message: `结果值结构解析失败：${e}`
      }
      throw new HttpException(url, status, statusText, body, `结果值结构解析失败：${e}`);
    }
  }

  // 收到未登录响应删除 cookie
  if (status === 401) {
    Cookies.remove(SITE_COOKIE_NAME)
  }

  try {
    if (status === 422) {
      body = fieldsErrorSchema.parse(body);
    } else {
      body = errorMsgSchema.parse(body)
    }
  } catch (e) {
    console.error(e)
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

    for (let str of param.split("&")) {
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
  return !!queryParam ? qs.stringify(queryParam) : ""
};

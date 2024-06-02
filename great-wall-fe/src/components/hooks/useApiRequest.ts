import {Options, Plugin, Service} from "ahooks/lib/useRequest/src/types";
import {useRequest} from "ahooks";
import {HttpException} from "@/constant/api";
import {isBlank} from "@/utils/Utils.ts";
import {LOGIN_REDIRECT_URL_KEY} from "@/constant";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";

export interface ApiRequestOptions<TData, TParams extends any[]> extends Options<TData, TParams> {

  /**
   * 是否通知异常信息，默认通知，false 不通知
   */
  noticeError?: boolean

  /**
   * 出现未认证错误时是否重定向到登录页，默认未 true
   */
  unauthorizedRedirectLogin?: boolean

}

/**
 * api request 内部使用 useRequest 添加请求错误通知
 * @param service
 * @param options
 * @param plugins
 */
const useApiRequest = <TData, TParams extends any[]>(service: Service<TData, TParams>, options?: ApiRequestOptions<TData, TParams>, plugins?: Plugin<TData, TParams>[]) => {
  const {
    noticeError = true,
    unauthorizedRedirectLogin = true,
    ...otherOptions
  } = options || {};
  const navigate = useNavigate();

  return useRequest((...args) => {
    return new Promise<TData>(async (resolve, reject) => {
      try {
        const result = await service(...args);
        resolve(result);
      } catch (e) {
        if (noticeError) {
          let detail: string

          // http 异常状态码处理
          if (e instanceof HttpException) {
            detail = getErrorMessage(e)
          }
          // 其他异常！
          else {
            if (e instanceof Error) {
              const message = e.message
              detail = `未知的异常${isBlank(message) ? "!" : `: ${message}`}`
            } else {
              detail = `未知的异常!`
            }
          }

          toast.error(detail, {
            position: "top-right",
            duration: 3000
          })
        }

        // 当收到 401 状态码时，重定向到登录页面
        if (unauthorizedRedirectLogin && e instanceof HttpException && e.status === 401) {
          const url = `/login?${LOGIN_REDIRECT_URL_KEY}=${encodeURIComponent(window.location.href)}`
          navigate(url)
        }

        reject(e);
      }
    });

  }, otherOptions, plugins);
};

/**
 * 获取错误消息
 * @param e
 */
export const getErrorMessage = (e: HttpException) => {
  let detail: string
  const status = e.status;
  if (status === 401) {
    detail = "当前状态为未登录或者登录状态已过期！"
  } else if (status === 403) {
    detail = "无访问权限！"
  } else {
    const message = e.body?.message;
    if (!isBlank(message)) {
      detail = message!!
    } else {
      detail = `${e.url} 请求发生错误！`
    }
  }
  return detail;
}

export default useApiRequest;
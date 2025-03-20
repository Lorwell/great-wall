import {Options, Plugin, Result, Service} from "ahooks/lib/useRequest/src/types";
import {useCounter, useRequest,} from "ahooks";
import {HttpException} from "@/constant/api";
import {addPrefixNotBlank, isBlank} from "@/lib/utils";
import {LOGIN_REDIRECT_URL_KEY} from "@/constant";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";

export interface ApiRequestOptions<TData, TParams extends any[]> extends Options<TData, TParams> {

  /**
   * 是否通知异常信息，默认通知，false 不通知
   */
  noticeError?: boolean

  /**
   * 出现未认证错误时是否重定向到登录页，默认为 false
   */
  unauthorizedRedirectLogin?: boolean

  /**
   * 未认证重定向路径
   */
  unauthorizedRedirectPath?: string

  /**
   * 如果开启则仅仅在第一次加载数据时显示加载中状态，后续加载只更新数据不显示加载中
   *
   * 默认值 false
   */
  onlyFirstLoadingStatus?: boolean

}

/**
 * api request 内部使用 useRequest 添加请求错误通知
 * @param service
 * @param options
 * @param plugins
 */
const useApiRequest = <TData, TParams extends any[]>(
  service: Service<TData, TParams>,
  options?: ApiRequestOptions<TData, TParams>,
  plugins?: Plugin<TData, TParams>[]
): Result<TData, TParams> => {
  const {
    noticeError = true,
    unauthorizedRedirectLogin = true,
    unauthorizedRedirectPath = "/login",
    onlyFirstLoadingStatus = false,
    ...otherOptions
  } = options || {};
  const navigate = useNavigate();

  const [current, {inc}] = useCounter(0, {min: 0, max: 1});

  const request = useRequest((...args) => {
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

          toast.error(detail)
        }

        // 当收到 401 状态码时，重定向到登录页面
        if (unauthorizedRedirectLogin && e instanceof HttpException && e.status === 401) {
          const location = window.location;
          const redirectUrl = encodeURIComponent(`${location.pathname}${addPrefixNotBlank(location.search, "?")}`)
          const url = `${unauthorizedRedirectPath}?${LOGIN_REDIRECT_URL_KEY}=${redirectUrl}`
          navigate(url)
        }

        reject(e);
      } finally {
        inc()
      }
    });

  }, otherOptions, plugins);

  // 如果开启仅仅第一次显示加载状态
  if (onlyFirstLoadingStatus) {
    if (request.loading) {
      if (current > 0) {
        request.loading = false
      }
    }
  }

  return request;
};

/**
 * 获取错误消息
 * @param e
 */
export const getErrorMessage = (e: HttpException) => {
  let detail: string
  const status = e.status;
  const message = e.body?.message?.toString() as string | undefined;

  if (status === 401) {
    detail = "当前状态为未登录或者登录状态已过期！"
  } else if (status === 403) {
    detail = "无访问权限！"
  } else {
    detail = message || `${e.url} 请求发生错误！`
  }
  return detail;
}

export default useApiRequest;

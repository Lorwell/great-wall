import {useCreation, useMemoizedFn} from "ahooks";
import {useBlocker, useLocation} from "react-router-dom";
import {createContext, ReactNode, useCallback, useContext, useEffect} from "react";
import {isEmpty} from "radash";

export type RouteBeforeunloadCallback = (e?: BeforeUnloadEvent) => void;

export type RouteBeforeunloadContext = {

  registered: (pathname: string, callback: RouteBeforeunloadCallback, order: number) => void;

  cancel: (pathname: string, callback: RouteBeforeunloadCallback) => void;

}

export const RouteBeforeunloadContext = createContext<RouteBeforeunloadContext | null>(null)

type Callback = {
  callback: RouteBeforeunloadCallback
  order: number
}

/**
 * 用于在页面关闭前执行指定回调
 *
 * useRouteBeforeunload 必须在该组件之中运行
 * @param children
 * @constructor
 */
export function RouteBeforeunloadComponent(
  {
    children
  }: { children: ReactNode }) {
  const {pathname} = useLocation();

  const map = useCreation(() => new Map<string, Array<Callback>>, []);

  const getCallbacks = useCallback((pathname: string) => {
    if (map.has(pathname)) {
      return map.get(pathname)!!
    } else {
      map.set(pathname, new Array<Callback>());
      return map.get(pathname)!!
    }
  }, [map]);

  const context = useCreation<RouteBeforeunloadContext>(() => {
    return {
      registered: (pathname, callback, order) => {
        const callbacks = getCallbacks(pathname);
        callbacks.push({callback, order});
        const newCallbacks = callbacks.sort((a, b) => a.order - b.order);
        map.set(pathname, newCallbacks);
      },
      cancel: (pathname, callback) => {
        const callbacks = getCallbacks(pathname);
        const newCallbacks = callbacks.filter(c => c.callback !== callback);
        map.set(pathname, newCallbacks);
      }
    }
  }, [getCallbacks]);

  // 处理 beforeunload 事件
  const handleBeforeunload = useMemoizedFn((e?: BeforeUnloadEvent) => {
    const callbacks = getCallbacks(pathname);
    if (isEmpty(callbacks)) return
    map.delete(pathname);

    for (let {callback} of callbacks) {
      callback(e)
    }
  })

  // 处理 unload 事件
  const handleUnload = useMemoizedFn(() => {
    // 加一段同步代码阻塞一下，防止有请求导致发不出去
    let now = new Date().getTime()
    while (new Date().getTime() - now < 100) {
    }
  })

  // 阻止路由跳转
  useBlocker(() => {
    handleBeforeunload()
    return false;
  });

  useEffect(() => {
    window.addEventListener('beforeunload', handleBeforeunload)
    window.addEventListener('unload', handleUnload)
    return () => {
      window.removeEventListener('beforeunload', handleBeforeunload)
      window.removeEventListener('unload', handleUnload)
    }
  }, []);

  return (
    <RouteBeforeunloadContext.Provider value={context}>
      {children}
    </RouteBeforeunloadContext.Provider>
  )
}

/**
 * 路由卸载前
 * @param callback 回调方法
 * @param order 排序字段，值越小越先执行
 */
export function useRouteBeforeunload(callback: RouteBeforeunloadCallback,
                                     order?: number) {
  const context = useContext(RouteBeforeunloadContext);
  if (!context) throw new Error(`必须在 RouteBeforeunloadContext 上下文中执行`);

  const {pathname} = useLocation();

  useEffect(() => {
    context.registered(pathname, callback, order || 0);

    return () => {
      context.cancel(pathname, callback);
    }
  }, [callback, context, pathname])
}

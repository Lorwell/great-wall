import {useCreation} from "ahooks";
import {useLocation} from "react-router-dom";

/**
 * 解析路由上得 hash 路径
 */
export function useRouteHash(): Record<string, string> {
  const {hash} = useLocation();

  // 解析hash参数
  return useCreation(() => {
    const hashParams: Record<string, any> = {};
    hash.replace('#', '').split('&').forEach(pair => {
      const [key, value] = pair.split('=');
      if (key) {
        hashParams[key] = value || "";
      }
    });

    return hashParams;
  }, [hash])
}
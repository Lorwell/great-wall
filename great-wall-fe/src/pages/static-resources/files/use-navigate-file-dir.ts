import {useCallback} from "react";
import {useRouteHash} from "@/components/hooks/use-route-hash.ts";
import {useNavigate} from "react-router-dom";

export type NavigateFunction = {
  (to: string): void;
}

/**
 * 导航到指定文件目录
 */
export function useNavigateFileDir(): NavigateFunction {
  const navigate = useNavigate();
  return useCallback<NavigateFunction>((to) => {
    const hash = `#fileDir=${to}`
    navigate(hash)
  }, [navigate]);
}

/**
 * 获取当前导航的文件目录
 */
export function useGetFileDir() {
  const {fileDir} = useRouteHash();
  return fileDir || ""
}
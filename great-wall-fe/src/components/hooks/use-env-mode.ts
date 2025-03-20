import {useCreation} from "ahooks";

export type EnvMode = 'development' | 'production' | string
export type EnvModeResult = {
  mode: EnvMode
  isDev: boolean
}

/**
 * 获取当前环境模式
 */
export function useEnvMode(): EnvModeResult {
  const mode = import.meta.env.MODE;
  return useCreation(() => ({
    mode,
    isDev: mode === 'development',
  }), [mode])
}

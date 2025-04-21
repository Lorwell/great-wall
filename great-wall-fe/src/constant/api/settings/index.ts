import {getRequest, putJsonRequest} from "@/constant/api";
import {SettingsDto} from "@/constant/api/settings/types.ts";
import {settingsConfigSchema} from "@/constant/api/settings/schema.ts";

/**
 * 系统设置详情
 */
export function settingsDetails(): Promise<SettingsDto> {
  return getRequest(`/api/settings`);
}

/**
 * 系统设置更新
 */
export function settingsUpdate(input: SettingsDto): Promise<SettingsDto> {
  return putJsonRequest(`/api/settings`, {body: input, resultSchema: settingsConfigSchema});
}
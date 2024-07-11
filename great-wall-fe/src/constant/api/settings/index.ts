import {Get, PutJson} from "@/constant/api";
import {SettingsDto} from "@/constant/api/settings/types.ts";
import {settingsConfigSchema} from "@/constant/api/settings/schema.ts";

/**
 * 系统设置详情
 */
export function settingsDetails(): Promise<SettingsDto> {
  return Get(`/api/settings`);
}

/**
 * 系统设置更新
 */
export function settingsUpdate(input: SettingsDto): Promise<SettingsDto> {
  return PutJson(`/api/settings`, {body: input, resultSchema: settingsConfigSchema});
}
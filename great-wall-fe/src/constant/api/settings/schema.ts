import {z} from "zod";

export const settingsConfigSchema = z.object({
  redirectHttps: z.boolean({required_error: "不可以为空"})
})
export type SettingsConfigSchemaValues = z.infer<typeof settingsConfigSchema>

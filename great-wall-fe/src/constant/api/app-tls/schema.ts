import {z} from "zod";
import {baseOutputSchema} from "@/constant/api/schema.ts";
import {TlsTypeEnum} from "@/constant/api/app-tls/types.ts";

export const customsConfigSchema = z.object({
  type: z.enum([TlsTypeEnum.Custom]),
  certificate: z.string({required_error: "不可以为空"}),
  privateKey: z.string({required_error: "不可以为空"})
})

export type CustomConfigSchemaValues = z.infer<typeof customsConfigSchema>

export const osfipinConfigSchema = z.object({
  type: z.enum([TlsTypeEnum.Osfipin]),
  token: z.string({required_error: "不可以为空"}),
  user: z.string({required_error: "不可以为空"}),
  autoId: z.string({required_error: "不可以为空"}),
})

export type OsfipinConfigSchemaValues = z.infer<typeof osfipinConfigSchema>

export const configSchema = z.union([
  customsConfigSchema,
  osfipinConfigSchema
])

export type ConfigSchemaValues = z.infer<typeof configSchema>

export const tlsInputSchema = z.object({
  config: configSchema
})
export type TlsInputSchemaValues = z.infer<typeof tlsInputSchema>

export const tlsOutputSchema = z.object({
  expiredTime: z.number().optional().nullable(),
  config: configSchema
}).merge(baseOutputSchema)

export type TlsOutputSchemaValues = z.infer<typeof tlsOutputSchema>

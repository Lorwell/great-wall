import {z, ZodObject, ZodRawShape} from "zod";

// 基础响应
export const baseOutputSchema = z.object({
  id: z.number({required_error: "字段不可用为空"}),
  createTime: z.number({required_error: "字段不可用为空"}),
  lastUpdateTime: z.number({required_error: "字段不可用为空"})
})
export type BaseOutputSchemaValues = z.infer<typeof baseOutputSchema>

// 列表查询
export const baseListInputSchema = z.object({
  current: z.number().min(0).optional(),
  size: z.number().min(0).max(1000).optional(),
  orderBy: z.array(z.string()).optional(),
  orderDirection: z.enum(["ASC", "DESC"]).optional(),
  orderNullHandling: z.enum(["NATIVE", "NULLS_FIRST", "NULLS_LAST"]).optional(),
  keyword: z.string().optional(),
})

export type BaseListInputSchemaValues = z.infer<typeof baseListInputSchema>

// 基础消息
export const msgSchema = z.object({
  code: z.string(),
  message: z.string()
})

export type MsgValues = z.infer<typeof msgSchema>

// 错误消息
export const errorMsgSchema = z.object({
  code: z.string(),
  message: z.string()
})
export type ErrorMsgValues = z.infer<typeof errorMsgSchema>

export const fieldErrorSchema = msgSchema.merge(z.object({
  rejectedValue: z.any()
}))

export const fieldsErrorSchema = msgSchema.merge(z.object({
  fields: z.record(z.string(), z.array(fieldErrorSchema))
}))
export type FieldsErrorValues = z.infer<typeof fieldsErrorSchema>

/**
 * 分页列表结构
 * @param object
 */
export function getPageRecordSchema<T extends ZodRawShape>(object: ZodObject<T>) {
  return z.object({
    page: z.object({
      current: z.number(),
      size: z.number(),
      total: z.number(),
    }),
    records: z.array(object)
  })
}

/**
 * 列表结构
 * @param object
 */
export function getRecordSchema<T extends ZodRawShape>(object: ZodObject<T>) {
  return z.object({
    records: z.array(object)
  })
}
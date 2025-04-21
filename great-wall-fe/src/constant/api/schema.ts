import {z, ZodArray, ZodNumber, ZodObject, ZodTypeAny} from "zod";

// 基础响应
export const baseOutputSchema = z.object({
  id: z.number({required_error: "字段不可用为空"}),
  createTime: z.number({required_error: "字段不可用为空"}),
  lastUpdateTime: z.number({required_error: "字段不可用为空"})
})
export type BaseOutputSchemaValues = z.infer<typeof baseOutputSchema>

/**
 * 获取指定数据消息
 * @param data
 */
export function getDataMsg<T extends ZodTypeAny>(data: T) {
  return z.object({
    data: data
  })
}

export type DataMsg<T> = {
  data: T
}

export const dataStringMsg = getDataMsg(z.string({required_error: "不可以为空"}))
export type DataStringMsgSchema = z.infer<typeof dataStringMsg>


export enum SortDirectionEnum {
  ASC = "ASC", DESC = "DESC"
}

export enum SortNullHandlingEnum {
  NATIVE = 'NATIVE', NULLS_FIRST = 'NULLS_FIRST', NULLS_LAST = 'NULLS_LAST'
}

export const sortInputSchema = z.object({
  column: z.string(),
  direction: z.nativeEnum(SortDirectionEnum).optional().nullable(),
  nullHandling: z.nativeEnum(SortNullHandlingEnum).optional().nullable(),
});

export type SortInput = z.infer<typeof sortInputSchema>;

export const filterSchema = z.union([
  // 搜索
  z.object({
    type: z.literal("Like"),
    column: z.string(),
    query: z.string(),
  }),
  // 区间
  z.object({
    type: z.literal("Between"),
    column: z.string(),
    from: z.string().or(z.number()),
    to: z.string().or(z.number()),
  }),
  // 为空
  z.object({
    type: z.literal("IsNull"),
    column: z.string(),
  }),
  // 不为空
  z.object({
    type: z.literal("IsNotNull"),
    column: z.string(),
  }),
  // in
  z.object({
    type: z.literal("In"),
    column: z.string(),
    values: z.array(z.string().or(z.number())),
  }),
  // 等于
  z.object({
    type: z.literal("Eq"),
    column: z.string(),
    value: z.string().or(z.number()),
  }),
  // 不等于
  z.object({
    type: z.literal("Ne"),
    column: z.string(),
    value: z.string().or(z.number()),
  }),
  // 大于
  z.object({
    type: z.literal("Gt"),
    column: z.string(),
    value: z.number()
  }),
  // 大于等于
  z.object({
    type: z.literal("Ge"),
    column: z.string(),
    value: z.number()
  }),
  // 小于
  z.object({
    type: z.literal("Lt"),
    column: z.string(),
    value: z.number()
  }),
  // 小于等于
  z.object({
    type: z.literal("Le"),
    column: z.string(),
    value: z.number()
  })
])

export type FilterSchemaValues = z.infer<typeof filterSchema>

// 列表查询
export const baseListInputSchema = z.object({
  // 负数表示不分页
  current: z.coerce.number().default(-1),
  size: z.coerce.number().min(0).max(1000).optional().nullable(),
  orderBy: z.array(sortInputSchema).optional().nullable(),
  keyword: z.string().optional().nullable(),
  filters: z.array(filterSchema).optional().nullable(),
})

export type BaseListInputSchemaValues = z.infer<typeof baseListInputSchema>

// 基础消息
export const msgSchema = z.object({
  code: z.string(),
  message: z.string()
})


// 错误消息
export const errorMsgSchema = msgSchema

export type ErrorMsgValues = z.infer<typeof errorMsgSchema>

export const fieldErrorSchema = msgSchema.merge(z.object({
  rejectedValue: z.any()
}))

export const fieldsErrorSchema = msgSchema.merge(z.object({
  fields: z.record(z.string(), z.array(fieldErrorSchema))
}))
export type FieldsErrorValues = z.infer<typeof fieldsErrorSchema>

export const pageOutputSchema = z.object({
  current: z.coerce.number(),
  size: z.coerce.number(),
  total: z.coerce.number(),
})
export type PageOutput = z.infer<typeof pageOutputSchema>

export type PageRecordsSchema<T extends ZodTypeAny> = ZodObject<{
  page: ZodObject<{
    current: ZodNumber,
    size: ZodNumber,
    total: ZodNumber
  }>,
  records: ZodArray<T>
}>

export type PageRecords<T> = {
  page: {
    current: number,
    size: number,
    total: number
  },
  records: Array<T>
}

/**
 * 分页列表结构
 * @param object
 */
export function getPageRecordSchema<T extends ZodTypeAny>(object: T): PageRecordsSchema<T> {
  return z.object({
    page: pageOutputSchema,
    records: z.array(object)
  })
}

/**
 * 列表结构
 * @param object
 */
export function getRecordSchema<T extends ZodTypeAny>(object: T) {
  return z.object({
    records: z.array(object)
  })
}

export const stringRecordsSchema = getRecordSchema(z.string({required_error: "不可以为空"}))
export type StringRecords = z.infer<typeof stringRecordsSchema>


export const nameValueSchema = z.object({
  name: z.string({required_error: "不可以为空"}).min(1, "不可以为空"),
  value: z.string({required_error: "不可以为空"}).min(1, "不可以为空"),
})


export const valueSchema = z.object({
  value: z.string({required_error: "不可以为空"}).min(1, "不可以为空"),
})

// 文件输出结构
export const fileOutputSchema = z.object({
  id: z.number({required_error: "不可以为空"}),
  checksum: z.string({required_error: "不可以为空"}),
  createTime: z.string({required_error: "不可以为空"}),
  fileName: z.string({required_error: "不可以为空"}),
  size: z.number({required_error: "不可以为空"}),
})

export type FileOutputSchema = z.infer<typeof fileOutputSchema>

export const aiEntitySchema = z.object({
  conversationId: z.string({required_error: "不可以为空"}),
  messageId: z.string({required_error: "不可以为空"}),
})

/**
 * 列表结构
 * @param object
 */
export function getAiEntitySchema<T extends ZodTypeAny>(object: T) {
  return aiEntitySchema.merge(
    z.object({
      records: object
    })
  )
}

export const aiQuerySchema = z.object({
  conversationId: z.string().optional().nullish(),
  query: z.string().optional().nullish(),
})
export type AiQueryInput = z.infer<typeof aiQuerySchema>

// ------------------

export enum AiEventTypeEnum {
  /**
   * web 搜索开始
   */
  WebSearchStart = "web-search-start",

  /**
   * web 搜索完成
   */
  WebSearchEnd = "web-search-end",

  /**
   * web 搜索结果阅读开始
   */
  WebSearchResultReadStart = "web-search-result-read-start",

  /**
   * web 搜索结果阅读进度
   */
  WebSearchResultReadProgress = "web-search-result-read-progress",

  /**
   * web 搜索结果阅读完成
   */
  WebSearchResultReadEnd = "web-search-result-read-end",

  /**
   * 消息
   */
  Message = "message",
}

export type AiEntity = z.infer<typeof aiEntitySchema>


export type DefaultAiEntity<T extends ZodTypeAny> = AiEntity & {
  records: T
}

export type AiEvent = AiEntity

export type AiMessageEvent = AiEvent & {
  eventType: AiEventTypeEnum.Message
  message: string
}

export type ServerSentEvent<T> = {
  id: string,
  event: AiEventTypeEnum,
  retry?: number,
  comment?: string
  data: T
}


import {z} from "zod";

export const baseOutputSchema = z.object({
  id: z.number({required_error: "字段不可用为空"}),
  createTime: z.date({required_error: "字段不可用为空"}),
  lastUpdateTime: z.date({required_error: "字段不可用为空"})
})

export type BaseOutputSchemaValues = z.infer<typeof baseOutputSchema>
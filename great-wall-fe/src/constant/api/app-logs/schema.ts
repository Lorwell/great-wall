import {z} from "zod";
import {LogTypeEnum} from "@/constant/api/app-logs/types.ts";
import {getRecordSchema} from "@/constant/api/schema.ts";

export const logListOutputSchema = z.object({
  name: z.string({required_error: "不可以为空"}),
  type: z.enum([LogTypeEnum.ACCESS, LogTypeEnum.ROOT]),
  size: z.number({required_error: "不可以为空"}),
  lastUpdateTime: z.number({required_error: "字段不可用为空"})
});

export type LogListOutputSchemaValues = z.infer<typeof logListOutputSchema>

export const logListRecordsOutputSchema = getRecordSchema(logListOutputSchema);
export type LogListRecordsOutputSchemaValues = z.infer<typeof logListRecordsOutputSchema>
import {LogListRecordsOutput} from "@/constant/api/app-logs/types.ts";
import {Get} from "@/constant/api";
import {logListRecordsOutputSchema} from "@/constant/api/app-logs/schema.ts";

/**
 * 日志列表
 */
export function logsList(): Promise<LogListRecordsOutput> {
  return Get(`/api/logs`, {resultSchema: logListRecordsOutputSchema});
}
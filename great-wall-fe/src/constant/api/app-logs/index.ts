import {LogListRecordsOutput, LogTypeEnum} from "@/constant/api/app-logs/types.ts";
import {getRequest} from "@/constant/api";
import {logListRecordsOutputSchema} from "@/constant/api/app-logs/schema.ts";

/**
 * 日志列表
 */
export function logsList(type?: LogTypeEnum): Promise<LogListRecordsOutput> {
  return getRequest(`/api/logs`,
    {
      queryParam: {type},
      resultSchema: logListRecordsOutputSchema
    });
}
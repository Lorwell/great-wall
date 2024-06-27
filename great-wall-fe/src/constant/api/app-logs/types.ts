import {LogListOutputSchemaValues, LogListRecordsOutputSchemaValues} from "@/constant/api/app-logs/schema.ts";

export enum LogTypeEnum {

  /**
   * 系统日志
   */
  ROOT = "ROOT",

  /**
   * 访问日志
   */
  ACCESS = "ACCESS"

}

export type LogListOutput = Partial<LogListOutputSchemaValues>
export type LogListRecordsOutput = Partial<LogListRecordsOutputSchemaValues>
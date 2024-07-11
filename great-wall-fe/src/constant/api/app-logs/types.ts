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

/**
 * 日志类型转中文
 * @param type
 */
export function logTypeChinese(type: LogTypeEnum): string {
  switch (type) {
    case "ROOT":
      return "系统日志"
    case "ACCESS":
      return "访问日志"
  }
  return "未知"
}

export type LogListOutput = Partial<LogListOutputSchemaValues>
export type LogListRecordsOutput = Partial<LogListRecordsOutputSchemaValues>
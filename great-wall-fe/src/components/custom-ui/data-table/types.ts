import {IconType} from "@/components/types.tsx";

/**
 * 枚举类型过滤器 ==> 多选
 */
export type EnumFilterOptions = {
  type: "Enum",
  columnId: string
  label?: string,
  options: {
    label: string
    value: string
    icon?: IconType
  }[]
}

export enum DateTimeFormatEnum {

  /**
   * 用途: 仅存储年月部分（年、月）。
   *
   * 示例: 2023-10
   */
  YEAR_MONTH = "YEAR_MONTH",

  /**
   * 用途: 仅存储日期部分（年、月、日）。
   *
   * 示例: 2023-10-05
   */
  DATE = "DATE",

  /**
   * 用途: 存储日期和时间（年、月、日、时）。
   *
   * 示例: 2023-10-05 14
   */
  YEAR_MONTH_DAY_HOUR = "YEAR_MONTH_DAY_HOUR",

  /**
   * 用途: 存储日期和时间（年、月、日、时、分）。
   *
   * 示例: 2023-10-05 14:30
   */
  YEAR_MONTH_DAY_HOUR_MINUTE = "YEAR_MONTH_DAY_HOUR_MINUTE",

  /**
   * 用途: 存储日期和时间（年、月、日、时、分、秒）。
   *
   * 示例: 2023-10-05 14:30:45
   */
  TIMESTAMP = "TIMESTAMP",

  /**
   * 用途: 存储时间（时、分、秒）。
   *
   * 示例: 14:30:45
   */
  TIME = "TIME",

  /**
   * 用途: 存储时间（时、分）。
   *
   * 示例: 14:30
   */
  HOUR_MINUTE = "HOUR_MINUTE",

}


/**
 * 时间类型过滤器 ==> 范围选择
 */
export type DateTimeFilterOptions = {
  type: "DateTime",
  columnId: string
  label?: string,
  format: DateTimeFormatEnum
}

/**
 * 数值类型过滤器 ==> 区间匹配
 */
export type NumberFilterOptions = {
  type: "Number",
  columnId: string
  label?: string,
  precision: number
  scale: number
}

/**
 * 字符类型过滤器 ==> 模糊搜索
 */
export type StringFilterOptions = {
  type: "String",
  columnId: string
  label?: string,
}

export type DataTableFilter =
  EnumFilterOptions
  | DateTimeFilterOptions
  | NumberFilterOptions
  | StringFilterOptions

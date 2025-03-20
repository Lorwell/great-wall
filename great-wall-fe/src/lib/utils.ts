import _ from "lodash";
import {cn as shadcn} from "./shadcnUtils.ts"

export const cn = shadcn

/**
 * 是否为空白字符串
 * @param value
 */
export const isBlank = (value: string | undefined | null): boolean => {
  return _.isUndefined(value) || _.isNull(value) || _.isEmpty(value) || _.isEmpty(value?.trim());
}

/**
 * 是否为空
 * @param value
 */
export const isNull = (value: any | undefined | null): boolean => {
  return _.isUndefined(value) || _.isNull(value);
}

/**
 * 是否为空
 * @param value
 */
export const isEmpty = (value: Array<any> | Map<any, any> | Set<any> | undefined | null): boolean => {
  return _.isEmpty(value);
}

/**
 * 获取当前的域
 */
export const getDomain = (): string => {
  const {protocol, host} = window.location;
  return `${protocol}//${host}`
}


/**
 * 删除前缀
 * @param str
 * @param prefix
 */
export const removePrefix = (str: string, prefix: string) => {
  if (!str.startsWith(prefix)) {
    return str
  }

  return str.substring(prefix.length)
}

/**
 * 添加前缀，如果不存在
 * @param str
 * @param prefix
 */
export const addPrefix = (str: string, prefix: string) => {
  if (str.startsWith(prefix)) {
    return str
  }

  return prefix + str
}


/**
 * 如果不为空则添加前缀
 * @param str
 * @param prefix
 */
export const addPrefixNotBlank = (str: string | null, prefix: string) => {
  if (!str || isBlank(str)) return ""
  return addPrefix(str, prefix)
}

/**
 * 添加后缀，如果不存在
 * @param str
 * @param suffix
 */
export const addSuffix = (str: string, suffix: string) => {
  if (str.endsWith(suffix)) {
    return str
  }

  return str + suffix
}

/**
 * 删除后缀，如果存在
 * @param str
 * @param suffix
 */
export const removeSuffix = (str: string, suffix: string) => {
  if (!str.endsWith(suffix)) {
    return str
  }

  return str.substring(0, str.length - suffix.length)
}

/**
 *  大小转换
 * @param size
 * @param defaultValue 默认值
 */
export const byteSizeToUnitStr = (size?: number,
                                  defaultValue?: string): string => {
  if (!size)
    return defaultValue || "";

  const num = 1024.00; //byte

  if (size < num)
    return size + "B";
  if (size < Math.pow(num, 2))
    return (size / num).toFixed(2) + "K"; //kb
  if (size < Math.pow(num, 3))
    return (size / Math.pow(num, 2)).toFixed(2) + "M"; //M
  if (size < Math.pow(num, 4))
    return (size / Math.pow(num, 3)).toFixed(2) + "G"; //G
  return (size / Math.pow(num, 4)).toFixed(2) + "T"; //T
}


/**
 * 下载文件
 * @param filename 文件名称
 * @param url 文件地址
 */
export const downloadFile = (filename: string,
                             url: string) => {
  const link = document.createElement('a')
  link.style.display = 'none'
  link.href = url
  link.setAttribute('download', filename)
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 *  百分比转换
 * @param size
 * @param defaultValue 默认值
 */
export const percentageFormat = (size?: number,
                                 defaultValue?: string): string => {
  if (!size)
    return defaultValue || "";

  return Math.round(size * 10000) / 100 + '%'
}


/**
 * 计算最大值
 * @param precision 总位数
 * @param scale 小数部分
 */
export function calculateMaxNumber(precision: number, scale: number): number {
  if (precision < scale) {
    throw new Error("精度必须大于或等于小数位数");
  }

  // 计算整数部分的最大值
  const integerPart = Math.pow(10, precision - scale) - 1;

  // 计算小数部分的最大值
  const fractionalPart = (Math.pow(10, scale) - 1) / Math.pow(10, scale);

  // 整体最大值
  return integerPart + fractionalPart;
}

/**
 * 计算最小值
 * @param precision 总位数
 * @param scale 小数部分
 */
export function calculateMinNumber(precision: number, scale: number): number {
  if (precision < scale) {
    throw new Error("精度必须大于或等于小数位数");
  }

  // 最小值为负数时，整数部分的最小值
  const integerPart = -(Math.pow(10, precision - scale) - 1);

  // 小数部分的最小值（如果有小数部分）
  const fractionalPart = scale > 0 ? -((Math.pow(10, scale) - 1) / Math.pow(10, scale)) : 0;

  // 整体最小值
  return integerPart + fractionalPart;
}

/**
 * 计算最小步进
 * @param precision 总位数
 * @param scale 小数部分
 */
export function calculateMinStep(precision: number, scale: number): number {
  if (precision < scale) {
    throw new Error("精度必须大于或等于小数位数");
  }

  // 最小步进是 10^(-scale)
  return Math.pow(10, -scale);
}

/**
 * 为指定位数的数值补充 0
 */
export function fillZero(precision: number, num: number | string): string {
  let numStr = `${num}`;
  const len = precision - numStr.length;
  if (len <= 0) return numStr

  for (let i = 0; i < len; i++) {
    numStr = `0${numStr}`
  }
  return numStr
}

/**
 * 判断是否可以转为整数
 * @param char
 */
export function isToInt(char: string) {
  return !isNaN(parseInt(char))
}
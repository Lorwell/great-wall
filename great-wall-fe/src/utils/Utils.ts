import _ from "lodash";

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
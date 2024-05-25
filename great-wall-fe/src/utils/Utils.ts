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
 * 数字字符
 */
const NUMBER_CHAR = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "0"]

/**
 * 字母字符
 */
const CHARACTER = ["q", "w", "e", "r", "t", "y", "u", "i", "o", "p", "a", "s", "d", "f", "g", "h", "j", "k", "l", "z", "x", "c", "v", "b", "n", "m"]

/**
 * 普通的字符，即不包含标点符号的字符
 */
const NORMAL_CHARACTERS = [...NUMBER_CHAR, ...CHARACTER]

/**
 * 获取随机长度的字符串
 * @param size
 */
export const randomStr = (size: number): string => {
    let str = ""
    for (let i = 0; i < size; i++) {
        const index = _.random(0, NORMAL_CHARACTERS.length - 1, false);
        str += NORMAL_CHARACTERS[index];
    }

    return str
}

/**
 * 在 img src 的路径中添加随机的查询参数
 * @param src
 * @param paramsKey
 */
export const randomImgSrcQueryParams = (src: string,
                                        paramsKey: string = "_randomKey"): string => {
    const params = new Array<string>();

    // 如果 src 上带了查询参数
    const i = src.indexOf("?");
    if (i > 0) {
        const param = src.substring(i + 1, src.length);
        for (let str of _.split(param, "&")) {
            params.push(str);
        }
        src = src.substring(0, i);
    }

    params.push(`${encodeURIComponent(paramsKey)}=${encodeURIComponent(randomStr(6))}`)

    if (params.length > 0) {
        src = src + "?" + params.join("&");
    }

    return src;

}
import {template} from "radash";
import {useLocation, useNavigate} from "react-router-dom";
import {isNull, removePrefix} from "@/lib/utils.ts";
import {useCreation} from "ahooks";

export type PathInfo = {
  isMatches: false
} | {
  isMatches: true
  pathTemplate: string;
  originPathVariate: Record<string, string | null>;
}

export type ParsePathInfoOptions = {
  pathExpression: string,
  pathname?: string,
}

/**
 * 解析路径信息
 * @param pathExpression 路径表达式
 * @param pathname 路径
 */
function parsePathInfo(
  {
    pathExpression,
    pathname,
  }: ParsePathInfoOptions
): PathInfo {
  const pathExpressionFragments = removePrefix(pathExpression, "/").split("/");
  const pathExpressionFragmentsLen = pathExpressionFragments.length;

  const pathnameFragments = !pathname ? [] : removePrefix(pathname, "/").split("/");
  const pathnameFragmentsLen = pathnameFragments.length;

  // 表达式长度大于实际路径长度
  if (pathExpressionFragmentsLen > pathnameFragmentsLen) {
    return {
      isMatches: false,
    }
  }

  let pathTemplate = "";
  const originPathVariate: Record<string, string | null> = {};

  for (let i = 0; i < pathExpressionFragmentsLen; i++) {
    const expressionFragment = pathExpressionFragments[i];
    const pathnameFragment = pathnameFragmentsLen > i ? pathnameFragments[i] : null;

    // 路径变量以 : 开头
    if (expressionFragment.startsWith(":")) {
      const variate = removePrefix(expressionFragment, ":");
      originPathVariate[variate] = pathnameFragment;
      pathTemplate += `/{{${variate}}}`;
    }
    // ** 匹配任意片段和任意长度
    else if (expressionFragment === "**") {
      for (let j = i; j < pathnameFragmentsLen; j++) {
        pathTemplate += `/${pathnameFragments[j]}`;
      }
      break;
    }
    // * 匹配一个片段中的任意长度
    else if (!!pathnameFragment && expressionFragment.startsWith("*")) {
      const end = removePrefix(expressionFragment, "*");
      if (!pathnameFragment.endsWith(end)) {
        throw new Error(`表达式路径片段[${i}]的结尾与实际路径片段不符，表达式:${pathExpression},实际路径：${pathname}`);
      }
      pathTemplate += `/${pathnameFragment}`;
    }
    // 原路径
    else {
      if (!!pathnameFragment && expressionFragment !== pathnameFragment) {
        console.debug(`表达式路径片段[${i}]与实际路径片段不符，表达式:${pathExpression},实际路径：${pathname}`)
        return {
          isMatches: false,
        }
      }

      pathTemplate += `/${expressionFragment}`;
    }
  }

  return {
    isMatches: true,
    pathTemplate,
    originPathVariate,
  };

}

/**
 * 将路径信息的匹配值填充到路径模板中
 */
function replacePathname(props: ParsePathInfoOptions): string {
  return replacePathVariate(parsePathInfo(props))
}

/**
 * 替换路径变量
 * @param pathInfo
 * @param variateParams
 */
function replacePathVariate(pathInfo: PathInfo, variateParams?: Record<string, any>): string {
  if (!pathInfo.isMatches) {
    throw new Error(`路径不匹配无法替换变量值`)
  }

  const pathVariate: Record<string, string | number | null> = {};

  const originPathVariate = pathInfo.originPathVariate;
  if (!!originPathVariate) {
    for (let k in originPathVariate) {
      pathVariate[k] = originPathVariate[k];
    }
  }

  // 变量参数覆盖
  if (!isNull(variateParams)) {
    for (let k in variateParams) {
      pathVariate[k] = variateParams[k];
    }
  }

  return template(pathInfo.pathTemplate, pathVariate, /{{([\s\S]+?)}}/g);
}

export type RoutePathVariateOptions = {
  pathExpression: string,
}

/**
 * 路由路径变量hooks，基于路径表达式替换实际路径变量
 *
 * 模板占位符：
 * : 以此为的前缀 表示变量
 * * 表示单个路径片段的前缀任意字符匹配
 * ** 表示任意片段任意字符匹配(注意 ** 应该在表达式的末尾)
 *
 * 示例：/overview/projectGroup-group/:projectGroupId/**
 */
const useRoutePathVariate = (pathExpression: string): RoutePathVariate => {
  const navigate = useNavigate();
  const {pathname} = useLocation();

  return useCreation(() => {
    const pathInfo = parsePathInfo({pathExpression, pathname});

    if (!pathInfo.isMatches) {
      return {
        isMatches: false,
        pathVariate: {},
        replaceVariate: () => {
          throw new Error(`路径不匹配无法替换变量值`)
        },
        replaceVariateAndToNavigate: () => {
          throw new Error(`路径不匹配无法替换变量值`)
        }
      };
    }

    return {
      isMatches: true,
      pathVariate: pathInfo.originPathVariate || {},
      replaceVariate: (variateParams) => replacePathVariate(pathInfo, variateParams),
      replaceVariateAndToNavigate: (variateParams) => {
        const path = replacePathVariate(pathInfo, variateParams);
        navigate(path);
      }
    };
  }, [pathExpression, pathname]);
};

export interface RoutePathVariate {

  /**
   * 是否匹配
   */
  isMatches: boolean

  /**
   * 路径变量
   */
  pathVariate: Record<string, string | null>;

  /**
   * 替换路径变量
   * @param variateParams 变量参数
   * @return 替换后路径
   */
  replaceVariate: (variateParams?: Record<string, any>) => string;

  /**
   * 替换路径变量并且进行导航
   * @param variateParams 变量参数
   */
  replaceVariateAndToNavigate: (variateParams?: Record<string, any>) => void;

}

export default useRoutePathVariate;
export {
  parsePathInfo,
  replacePathVariate,
  replacePathname
}
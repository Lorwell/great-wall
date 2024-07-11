import _ from "lodash";
import {useLocation, useNavigate} from "react-router-dom";

export interface PathInfo {
  pathTemplate: string;
  originPathVariate?: Record<string, string | null>;
}

/**
 * 解析路径信息
 * @param pathExpression 路径表达式
 * @param pathname 路径
 */
function parsePathInfo(pathExpression: string, pathname?: string): PathInfo {
  const pathExpressionFragments = _.split(_.trimStart(pathExpression, "/"), "/");
  const pathnameFragments = _.isUndefined(pathname) ? [] : _.split(_.trimStart(pathname, "/"), "/");

  let pathTemplate = "";
  const originPathVariate: Record<string, string | null> = {};

  for (let i = 0; i < pathExpressionFragments.length; i++) {
    const expressionFragment = pathExpressionFragments[i];
    const pathnameFragment = pathnameFragments.length > i ? pathnameFragments[i] : null;

    // 路径变量以 : 开头
    if (_.startsWith(expressionFragment, ":")) {
      const variate = _.trimStart(expressionFragment, ":");
      originPathVariate[variate] = pathnameFragment;
      pathTemplate += `/{{${variate}}}`;
    }
    // ** 匹配任意片段和任意长度
    else if (expressionFragment === "**") {
      for (let j = i; j < pathnameFragments.length; j++) {
        pathTemplate += `/${pathnameFragments[j]}`;
      }
      break;
    }
    // * 匹配一个片段中的任意长度
    else if (!!pathnameFragment && _.startsWith(expressionFragment, "*")) {
      const end = _.trimStart(expressionFragment, "*");
      if (!_.endsWith(pathnameFragment, end)) {
        throw new Error(`表达式路径片段[${i}]的结尾与实际路径片段不符，表达式:${pathExpression},实际路径：${pathname}`);
      }
      pathTemplate += `/${pathnameFragment}`;
    }
    // 原路径
    else {
      // if (!!pathnameFragment && expressionFragment !== pathnameFragment) {
      //   throw new Error(`表达式路径片段[${i}]与实际路径片段不符，表达式:${pathExpression},实际路径：${pathname}`);
      // }

      pathTemplate += `/${expressionFragment}`;
    }
  }
  return {
    pathTemplate,
    originPathVariate,
  };
}

/**
 * 获取路径信息，其中包含缓存策略
 * @param pathExpression
 * @param pathname
 */
function getPathInfo(pathExpression: string, pathname?: string): PathInfo {
  return parsePathInfo(pathExpression, pathname);
}

/**
 * 将路径信息的匹配值填充到路径模板中
 * @param pathExpression
 * @param pathname
 */
function replacePathname(pathExpression: string, pathname: string): string {
  return replacePathVariate(getPathInfo(pathExpression, pathname))
}

/**
 * 替换路径变量
 * @param pathInfo
 * @param variateParams
 */
function replacePathVariate(pathInfo: PathInfo, variateParams?: Record<string, any>) {
  const templateExecutor = _.template(pathInfo.pathTemplate, {interpolate: /{{([\s\S]+?)}}/g});

  const pathVariate: Record<string, string | number | null> = {};

  const originPathVariate = pathInfo.originPathVariate;
  if (!_.isUndefined(originPathVariate)) {
    for (let k in originPathVariate) {
      pathVariate[k] = originPathVariate[k];
    }
  }

  // 变量参数覆盖
  if (!_.isUndefined(variateParams)) {
    for (let k in variateParams) {
      pathVariate[k] = variateParams[k];
    }
  }

  return templateExecutor(pathVariate);
}

/**
 * 路由路径变量hooks，基于路径表达式替换实际路径变量
 *
 * 模板占位符：
 * : 以此为的前缀 表示变量
 * * 表示单个路径片段的前缀任意字符匹配
 * ** 表示任意片段任意字符匹配(注意 ** 应该在表达式的末尾)
 *
 * 示例：
 *  /overview/projectGroup-group/:projectGroupId/**
 *
 * @param pathExpression 路径模板
 */
const useRoutePathVariate = (pathExpression: string): RoutePathVariate => {
  const navigate = useNavigate();
  const {pathname} = useLocation();

  const pathInfo = getPathInfo(pathExpression, pathname);


  return {
    pathVariate: pathInfo.originPathVariate || {},
    replaceVariate: (variateParams) => replacePathVariate(pathInfo, variateParams),
    replaceVariateAndToNavigate: (variateParams) => {
      const path = replacePathVariate(pathInfo, variateParams);
      navigate(path);
    }
  };
};

export interface RoutePathVariate {

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
  getPathInfo,
  replacePathVariate,
  replacePathname
}
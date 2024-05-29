import {Route} from "react-router-dom";
import BaseInfoConfPage from "@/pages/app-routes/components/app-routes/base-info-conf-page.tsx";
import PredicatesConfPage from "@/pages/app-routes/components/app-routes/predicates-conf-page.tsx";
import {SidebarNavItem} from "@/pages/app-routes/components/app-routes/layout.tsx";
import PluginsConfPage from "@/pages/app-routes/components/app-routes/plugins-conf-page.tsx";
import PreviewConfPage from "@/pages/app-routes/components/app-routes/preview-conf-page.tsx";

/**
 * 侧边导航
 */
export const sidebarNavItems: SidebarNavItem[] = [
  {
    title: "基础信息",
    to: "/manage/app-routes/add/base-info",
  },
  {
    title: "路由条件",
    to: "/manage/app-routes/add/predicates",
  },
  {
    title: "插件配置",
    to: "/manage/app-routes/add/filter",
  },
  {
    title: "配置预览",
    to: "/manage/app-routes/add/preview",
  }
]

/**
 * 添加应用路由的路由
 * @constructor
 */
export default function getAddAppRoutesRoutes() {
  return (
    <>
      <Route path="base-info" element={<BaseInfoConfPage/>}/>
      <Route path="predicates" element={<PredicatesConfPage/>}/>
      <Route path="filter" element={<PluginsConfPage/>}/>
      <Route path="preview" element={<PreviewConfPage/>}/>
    </>
  )
}

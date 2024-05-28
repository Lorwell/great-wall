import {Route} from "react-router-dom";
import {SidebarNavItem} from "@/pages/app-routes/components/app-routes/sidebar-nav.tsx";
import BaseInfoConfPage from "@/pages/app-routes/components/app-routes/base-info-conf-page.tsx";
import PredicatesConfPage from "@/pages/app-routes/components/app-routes/predicates-conf-page.tsx";

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
      <Route path="filter" element={<div>1</div>}/>
    </>
  )
}

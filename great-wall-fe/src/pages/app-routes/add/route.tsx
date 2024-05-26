import {Route} from "react-router-dom";
import {SidebarNavItem} from "@/pages/app-routes/components/sidebar-nav.tsx";
import BaseInfo from "@/pages/app-routes/components/app-routes/base-info.tsx";

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
        title: "路由数据",
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
            <Route path="base-info" element={<BaseInfo/>}/>
            <Route path="predicates" element={<div>1</div>}/>
            <Route path="filter" element={<div>1</div>}/>
        </>
    )
}

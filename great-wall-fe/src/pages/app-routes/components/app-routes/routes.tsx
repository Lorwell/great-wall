import {Route} from "react-router-dom";
import BaseInfoConfPage from "@/pages/app-routes/components/app-routes/base-info-conf-page.tsx";
import PredicatesConfPage from "@/pages/app-routes/components/app-routes/predicates-conf-page.tsx";
import PreviewConfPage from "@/pages/app-routes/components/app-routes/preview-conf-page.tsx";
import PluginsConfPage from "@/pages/app-routes/components/app-routes/plugins-conf-page.tsx";

/**
 * 配置应用路由的路由
 * @constructor
 */
export default function configAppRoutesRoutes() {
  return (
    <>
      <Route path="base-info" element={<BaseInfoConfPage/>}/>
      <Route path="predicates" element={<PredicatesConfPage/>}/>
      <Route path="filter" element={<PluginsConfPage/>}/>
      <Route path="preview" element={<PreviewConfPage/>}/>
    </>
  )
}

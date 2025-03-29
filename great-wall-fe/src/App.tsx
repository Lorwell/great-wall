import {ThemeProvider} from "@/components/theme-provider"
import './App.less'
import {Navigate, Outlet, Route, Routes, useLocation, useNavigate} from "react-router-dom"
import {lazy, Suspense, useEffect} from "react";
import {useAsyncEffect} from "ahooks";
import {isBlank, removePrefix, removeSuffix} from "@/lib/utils.ts";
import Error404 from "@/pages/Error404.tsx";
import SuspenseFallback from "@/pages/SuspenseFallback.tsx";
import {Toaster} from "@/components/ui/sonner.tsx";
import configAppRoutesRoutes from "@/pages/app-routes/components/app-routes/routes.tsx";

const Login = lazy(() => import("@/pages/login"));
const AppFrame = lazy(() => import("@/pages/AppFrame"));
const AppRouteList = lazy(() => import("@/pages/app-routes/list"));
const AddAppRoutes = lazy(() => import("@/pages/app-routes/add"));
const UpdateAppRoutes = lazy(() => import("@/pages/app-routes/update"));
const MonitorMetrics = lazy(() => import("@/pages/monitor-metrics"));
const RouteMetrics = lazy(() => import("@/pages/monitor-metrics/route-metrics"));
const ServerMetrics = lazy(() => import("@/pages/monitor-metrics/server-metrics"));
const LogList = lazy(() => import("@/pages/app-logs/list"));
const LogFile = lazy(() => import("@/pages/app-logs/file"));
const Tls = lazy(() => import("@/pages/tls"));
const CustomTls = lazy(() => import("@/pages/tls/custom/config.tsx"));
const OsfipinTls = lazy(() => import("@/pages/tls/osfipin/config.tsx"));
const Settings = lazy(() => import("@/pages/settings"));
const StaticResources = lazy(() => import("@/pages/static-resources"));

const App = () => {

  return (
    <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
      <Suspense fallback={<SuspenseFallback/>}>
        {/* 路由管理 */}
        <Routes>
          {/* 登录页面 */}
          <Route path="login" element={<Login/>}/>
          {/* 应用登录守卫 */}
          <Route path="" element={<LoginStatusGuard/>}>
            <Route path="manage" element={<AppFrame/>}>
              <Route path="" element={<Navigate to={"app-routes"}/>}/>
              {/* 路由配置 */}
              <Route path="app-routes" element={<EmptyRoute base={"/manage/app-routes"} to={"list"}/>}>
                <Route path="list" element={<AppRouteList/>}/>
                <Route path="add" element={<AddAppRoutes/>}>
                  {configAppRoutesRoutes()}
                </Route>
                <Route path=":id" element={<UpdateAppRoutes/>}>
                  {configAppRoutesRoutes()}
                </Route>
              </Route>
              {/* 静态资源 */}
              <Route path="static-resources">
                <Route path="" element={<StaticResources/>}/>
              </Route>
              {/* 监控指标 */}
              <Route path="monitor-metrics" element={<MonitorMetrics/>}>
                <Route path="route" element={<RouteMetrics/>}/>
                <Route path="server" element={<ServerMetrics/>}/>
              </Route>
              {/* 日志管理 */}
              <Route path="logs" element={<EmptyRoute base={"/manage/logs"} to={"list"}/>}>
                <Route path="list" element={<LogList/>}/>
                <Route path="type/:type/file/:file" element={<LogFile/>}/>
              </Route>
              {/* 证书管理 */}
              <Route path="tls">
                <Route path="" element={<Tls/>}/>
                <Route path="custom" element={<CustomTls/>}/>
                <Route path="osfipin" element={<OsfipinTls/>}/>
              </Route>
              {/* 系统设置页面 */}
              <Route path="settings" element={<Settings/>}/>
              <Route path="*" element={<Error404/>}/>
            </Route>
          </Route>
        </Routes>
      </Suspense>
      <Toaster position={"top-center"} duration={3000}/>
    </ThemeProvider>
  )
}

/**
 * 空路由，只用来重定向
 * @param base 匹配的基础路由地址
 * @param to 目标路由地址
 * @constructor
 */
const EmptyRoute = ({base, to}: { base: string, to: string }) => {
  const navigate = useNavigate();
  const {pathname} = useLocation();

  useEffect(() => {
    const baseRoute = removeSuffix(base, "/");
    if (baseRoute === removeSuffix(pathname, "/")) {
      navigate(`${baseRoute}/${removePrefix(to, "/")}`);
    }
  }, [pathname])

  return <Outlet/>;
}

/**
 * 登录状态守卫
 * @constructor
 */
const LoginStatusGuard = () => {
  const navigate = useNavigate();
  const {pathname} = useLocation();

  useAsyncEffect(async () => {
    if (isBlank(pathname) || pathname === "/") {
      navigate(`/manage`);
    }

  }, [pathname])

  return <Outlet/>;
}

export default App

import {ThemeProvider} from "@/components/theme-provider"
import './App.less'
import {Navigate, Outlet, Route, Routes, useLocation, useNavigate} from "react-router-dom"
import {lazy, Suspense, useEffect} from "react";
import {useAsyncEffect} from "ahooks";
import {isBlank, removePrefix, removeSuffix} from "@/utils/Utils.ts";
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

const App = () => {

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Suspense fallback={<SuspenseFallback/>}>
        {/* 路由管理 */}
        <Routes>
          {/* 登录页面 */}
          <Route path="login" element={<Login/>}/>
          {/* 应用登录守卫 */}
          <Route path="" element={<LoginStatusGuard/>}>
            <Route path="manage" element={<AppFrame/>}>
              <Route path="" element={<Navigate to={"app-routes"}/>}/>
              <Route path="app-routes" element={<EmptyRoute base={"/manage/app-routes"} to={"list"}/>}>
                <Route path="list" element={<AppRouteList/>}/>
                <Route path="add" element={<AddAppRoutes/>}>
                  {configAppRoutesRoutes()}
                </Route>
                <Route path=":id" element={<UpdateAppRoutes/>}>
                  {configAppRoutesRoutes()}
                </Route>
              </Route>
              <Route path="monitor-metrics" element={<MonitorMetrics/>}>
                <Route path="route" element={<RouteMetrics/>}/>
                <Route path="server" element={<ServerMetrics/>}/>
              </Route>
              <Route path="logs" element={<EmptyRoute base={"/manage/logs"} to={"list"}/>}>
                <Route path="list" element={<LogList/>}/>
              </Route>
              <Route path="*" element={<Error404/>}/>
            </Route>
          </Route>
        </Routes>
      </Suspense>
      <Toaster/>
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

import {ThemeProvider} from "@/components/theme-provider"
import './App.less'
import {Outlet, Route, Routes, useLocation, useNavigate} from "react-router-dom"
import {lazy} from "react";
import {useAsyncEffect} from "ahooks";
import {isBlank} from "@/utils/Utils.ts";
import Error404 from "@/pages/Error404.tsx";

const AppFrame = lazy(() => import("@/pages/AppFrame"));

const App = () => {

    return (
        <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
            {/* 路由管理 */}
            <Routes>
                {/* 登录页面 */}
                {/*<Route path="login" element={<Login/>}/>*/}
                {/* 应用登录守卫 */}
                <Route path="" element={<LoginStatusGuard/>}>
                    <Route path="manage" element={<AppFrame/>}>
                        <Route path="*" element={<Error404/>}/>
                    </Route>
                </Route>
            </Routes>
        </ThemeProvider>
    )
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

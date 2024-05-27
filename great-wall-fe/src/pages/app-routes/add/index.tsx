import Layout from "@/pages/app-routes/components/app-routes/layout.tsx";
import {sidebarNavItems} from "@/pages/app-routes/add/route.tsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useState} from "react";
import {
  AppRoutesContext,
  AppRoutesDataOptions,
  BaseInfoFormValues
} from "@/pages/app-routes/components/app-routes/schema.ts";

/**
 * 添加应用路由
 * @constructor
 */
function AddAppRoutes() {
  const {pathname} = useLocation();
  const navigate = useNavigate();

  const [data, setData] = useState<AppRoutesDataOptions>();

  useEffect(() => {
    if (pathname === "/manage/app-routes/add") {
      navigate("/manage/app-routes/add/base-info")
    }
  }, [])

  /**
   * 更新基础信息
   * @param newData
   */
  function setBaseInfo(newData: Partial<BaseInfoFormValues>) {
    setData({...data, baseInfo: newData})
  }

  return (
    <div className={"w-full h-full"}>
      <AppRoutesContext.Provider value={{...data, setBaseInfo}}>
        <Layout title={"新建应用路由"}
                items={sidebarNavItems}
        />
      </AppRoutesContext.Provider>
    </div>
  )
}

export default AddAppRoutes
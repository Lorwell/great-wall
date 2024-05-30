import Layout from "@/pages/app-routes/components/app-routes/layout.tsx";
import {useState} from "react";
import {
  AppRoutesConfValues,
  AppRoutesContext,
  AppRoutesDataOptions,
  BaseInfoFormValues,
  PredicatesFormValues
} from "@/pages/app-routes/components/app-routes/schema.ts";

/**
 * 添加应用路由
 * @constructor
 */
export default function AddAppRoutes() {
  const [data, setData] = useState<AppRoutesDataOptions>();

  /**
   * 更新基础信息
   * @param newData
   */
  function setBaseInfo(newData: Partial<BaseInfoFormValues>) {
    setData({...data, baseInfo: newData})
  }

  /**
   * 更新路由条件
   * @param newData
   */
  function setPredicates(newData: Partial<PredicatesFormValues>) {
    setData({...data, predicates: newData})
  }

  /**
   * 提交
   * @param data
   */
  function onSubmit(data: Partial<AppRoutesConfValues>) {
    console.log(data)
  }

  return (
    <div className={"h-full w-full"}>
      <AppRoutesContext.Provider value={{...data, setBaseInfo, setPredicates, onSubmit}}>
        <Layout title={"新建应用路由"}/>
      </AppRoutesContext.Provider>
    </div>
  )
}

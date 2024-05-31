import Layout from "@/pages/app-routes/components/app-routes/layout.tsx";
import {useState} from "react";
import {AppRoutesContext, AppRoutesDataOptions,} from "@/pages/app-routes/components/app-routes/schema.ts";
import {AppRoutesConfValues, BaseInfoFormValues, PredicatesFormValues} from "@/constant/api/app-routes/schema.ts";
import {createAppRoute} from "@/constant/api/app-routes";
import useApiRequest from "@/components/hooks/useApiRequest.ts";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";

/**
 * 添加应用路由
 * @constructor
 */
export default function AddAppRoutes() {
  const [data, setData] = useState<AppRoutesDataOptions>();
  const navigate = useNavigate();

  const {runAsync} = useApiRequest(createAppRoute, {manual: true});

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
  async function onSubmit(data: Partial<AppRoutesConfValues>): Promise<void> {
    await runAsync(data)

    toast.info("应用路由添加成功", {position: "top-center"})

    // 提交成功返回列表
    navigate("/manage/app-routes/list")
  }

  return (
    <div className={"h-full w-full"}>
      <AppRoutesContext.Provider value={{...data, setBaseInfo, setPredicates, onSubmit}}>
        <Layout title={"新建应用路由"}/>
      </AppRoutesContext.Provider>
    </div>
  )
}

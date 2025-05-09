import Layout from "@/pages/app-routes/components/app-routes/layout.tsx";
import {AppRoutesContext,} from "@/pages/app-routes/components/app-routes/schema.ts";
import {AppRoutesConfValues} from "@/constant/api/app-routes/schema.ts";
import {createAppRoute} from "@/constant/api/app-routes";
import useApiRequest from "@/components/hooks/use-api-request.ts";
import {useNavigate} from "react-router-dom";
import {toast} from "sonner";
import {appRoutesDataOptionsState} from "@/pages/app-routes/components/app-routes/store.ts";
import useFirstEffectResetRecoilState from "@/components/hooks/use-first-effect-reset-recoil-state.ts";

/**
 * 添加应用路由
 * @constructor
 */
export default function AddAppRoutes() {
  const navigate = useNavigate();
  const {runAsync} = useApiRequest(createAppRoute, {manual: true});

  useFirstEffectResetRecoilState(appRoutesDataOptionsState);

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
      <AppRoutesContext.Provider value={{onSubmit}}>
        <Layout title={"新建应用路由"}/>
      </AppRoutesContext.Provider>
    </div>
  )
}

import {AppRoutesContext} from "@/pages/app-routes/components/app-routes/schema.ts";
import {useNavigate, useParams} from "react-router-dom";
import useApiRequest from "@/components/hooks/useApiRequest.ts";
import {appRouteDetails, updateAppRoute} from "@/constant/api/app-routes";
import {AppRoutesConfValues} from "@/constant/api/app-routes/schema.ts";
import {toast} from "sonner";
import Layout from "@/pages/app-routes/components/app-routes/layout.tsx";
import {useSetRecoilState} from "recoil";
import {appRoutesDataOptionsState} from "@/pages/app-routes/components/app-routes/store.ts";

/**
 * 更新应用路由
 * @constructor
 */
export default function UpdateAppRoutes() {
  const {id} = useParams();

  const navigate = useNavigate();

  const setAppRoutesDataOptions = useSetRecoilState(appRoutesDataOptionsState);

  // 加载数据
  const {loading} = useApiRequest(
    async () => {
      const data = await appRouteDetails(Number(id));
      setAppRoutesDataOptions({
        baseInfo: {
          name: data.name,
          describe: data.describe,
          priority: data.priority,
          status: data.status,
        },
        predicates: {
          targetConfig: data.targetConfig,
          predicates: data.predicates
        }
      })
    });

  const {runAsync: updateAppRouteRun} = useApiRequest(updateAppRoute, {manual: true});

  /**
   * 提交
   * @param data
   */
  async function onSubmit(data: Partial<AppRoutesConfValues>): Promise<void> {
    await updateAppRouteRun(Number(id), data)

    toast.info("应用路由更新成功", {position: "top-center"})

    // 提交成功返回列表
    navigate("/manage/app-routes/list")
  }

  return (
    <div className={"h-full w-full"}>
      <AppRoutesContext.Provider value={{onSubmit}}>
        <Layout title={"更新应用路由"} loading={loading}/>
      </AppRoutesContext.Provider>
    </div>
  )
}
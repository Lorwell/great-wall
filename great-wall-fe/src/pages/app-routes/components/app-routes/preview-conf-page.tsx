import BaseInfoConfPage from "@/pages/app-routes/components/app-routes/base-info-conf-page.tsx";
import PredicatesConfPage from "@/pages/app-routes/components/app-routes/predicates-conf-page.tsx";
import {useContext} from "react";
import {
  AppRoutesContext,
  baseInfoFormSchema,
  BaseInfoFormValues,
  predicatesFormSchema,
  PredicatesFormValues
} from "@/pages/app-routes/components/app-routes/schema.ts";
import {Button} from "@/components/ui/button.tsx";
import {toast} from "sonner";

/**
 * 插件配置
 * @constructor
 */
export default function PreviewConfPage() {
  const ctx = useContext(AppRoutesContext);

  /**
   * 提交
   */
  function handleSubmit() {
    let baseInfoData: Partial<BaseInfoFormValues>
    let predicates: Partial<PredicatesFormValues>

    try {
      baseInfoData = baseInfoFormSchema.parse(ctx.baseInfo);
      predicates = predicatesFormSchema.parse(ctx.predicates);
    } catch (e) {
      toast.warning("表单存在错误的字段，请检查！",
        {
          position: "top-center",
          duration: 3000,
        })
      return
    }

    ctx.onSubmit?.({...baseInfoData, ...predicates})
  }

  return (
    <div className={"flex flex-col space-y-6"}>
      <BaseInfoConfPage preview={true}/>
      <PredicatesConfPage preview={true}/>
      <div>
        <Button onClick={handleSubmit}>确认提交</Button>
      </div>
    </div>
  )
}
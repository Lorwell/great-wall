import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {settingsConfigSchema, SettingsConfigSchemaValues} from "@/constant/api/settings/schema.ts";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import useApiRequest from "@/components/hooks/useApiRequest.ts";
import {settingsDetails, settingsUpdate} from "@/constant/api/settings";
import LoadingBlock from "@/components/custom-ui/loading-block.tsx";
import useFromFieldErrorSpecification from "@/components/hooks/useFromFieldErrorSpecification.ts";
import {toast} from "sonner";

/**
 * 系统设置页面
 * @constructor
 */
export default function Settings() {

  const {loading: detailsLoading, runAsync: detailsRunAsync} = useApiRequest(settingsDetails, {manual: true});
  const {loading: updateLoading, runAsync: updateRunAsync} = useApiRequest(settingsUpdate, {manual: true});

  const form = useForm<SettingsConfigSchemaValues>({
    resolver: zodResolver(settingsConfigSchema),
    defaultValues: async () => await detailsRunAsync()
  })
  const specification = useFromFieldErrorSpecification(form);

  /**
   * 提交数据
   * @param data
   */
  async function onSubmit(data: SettingsConfigSchemaValues) {
    await specification(() => updateRunAsync(data));

    toast.info("系统设置更新成功", {position: "top-center"})
  }

  return (
    <div className={"w-full flex flex-col gap-4 ml-[80px]"}>
      <div className={"text-xl font-bold"}>系统设置</div>
      <Separator className="my-2"/>

      <LoadingBlock loading={detailsLoading}>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField control={form.control}
                       name="redirectHttps"
                       render={({field}) => (
                         <FormItem className="flex flex-row items-center space-x-3 space-y-0 p-4 pl-0">
                           <FormControl>
                             <Checkbox
                               checked={field.value}
                               onCheckedChange={field.onChange}
                             />
                           </FormControl>
                           <FormLabel>
                             http 请求是否重定向到 https
                           </FormLabel>
                         </FormItem>
                       )}
            />
            <Button type="submit"
                    loading={updateLoading}
                    className="w-28"
                    variant={"secondary"}>
              提交
            </Button>
          </form>
        </Form>
      </LoadingBlock>
    </div>
  )
}
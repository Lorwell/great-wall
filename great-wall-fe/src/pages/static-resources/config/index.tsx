import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {StaticResourcesInput, staticResourcesInputSchema} from "@/constant/api/static-resources/schema.ts";
import {useFormApiRequest} from "@/components/hooks/use-form-api-request.ts";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Input} from "@/components/ui/input.tsx";
import {createStaticResources, staticResourcesDetails, updateStaticResources} from "@/constant/api/static-resources";
import {useNavigate, useParams} from "react-router-dom";
import useApiRequest from "@/components/hooks/use-api-request.ts";
import LoadingBlock from "@/components/custom-ui/loading-block.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";

/**
 * 静态资源配置
 * @constructor
 */
export default function StaticResourcesConfig() {
  const {id} = useParams();
  const navigate = useNavigate();

  const form = useForm<StaticResourcesInput>({
    resolver: zodResolver(staticResourcesInputSchema),
  });

  const {
    loading,
    runAsync
  } = useFormApiRequest(
    async (input) => {
      if (id) {
        await updateStaticResources(Number(id), input)
      } else {
        await createStaticResources(input)
      }
    }, {form});

  /**
   * 提交数据
   */
  async function onSubmit(data: StaticResourcesInput) {
    await runAsync(data);
    navigate("/manage/static-resources")
  }

  const {
    loading: staticResourcesLoading
  } = useApiRequest(async () => {
    if (id) {
      return await staticResourcesDetails(Number(id))
    } else {
      return {name: "", describe: ""}
    }
  }, {
    onSuccess: (data) => {
      form.setValue("name", data.name)
      form.setValue("describe", data.describe)
    }
  });

  return (
    <div className={"w-[480px] flex flex-col gap-4 ml-[80px]"}>
      <div className={"text-lg font-bold"}>新增静态资源</div>
      <p className="text-sm text-muted-foreground">
        静态资源将实际映射为一个文件夹，存储上传的文件，后续可以关联应用路由提供访问
      </p>
      <div>
        <LoadingBlock loading={staticResourcesLoading}>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control}
                         name="name"
                         render={({field}) => (
                           <FormItem>
                             <FormLabel>名称</FormLabel>
                             <FormControl>
                               <Input {...field}  />
                             </FormControl>
                             <FormMessage/>
                             <FormDescription>静态资源的名称</FormDescription>
                           </FormItem>
                         )}
              />
              <FormField control={form.control}
                         name="describe"
                         render={({field}) => (
                           <FormItem>
                             <FormLabel>描述</FormLabel>
                             <FormControl>
                               <Textarea {...field} value={field.value || ""}/>
                             </FormControl>
                             <FormMessage/>
                             <FormDescription>静态资源的说明</FormDescription>
                           </FormItem>
                         )}
              />

              <Button type="submit" loading={loading} className="w-full" variant={"secondary"}>
                提交
              </Button>
            </form>
          </Form>
        </LoadingBlock>
      </div>
    </div>
  )
}
import {Separator} from "@/components/ui/separator.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Textarea} from "@/components/ui/textarea.tsx";
import {Button} from "@/components/ui/button.tsx";
import {
  AppRoutesContext,
  baseInfoFormSchema,
  BaseInfoFormValues
} from "@/pages/app-routes/components/app-routes/schema.ts";
import {useContext} from "react";
import {useLayoutOutletContext} from "@/pages/app-routes/components/app-routes/layout.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {AppRouteStatusEnum} from "@/constant/api/app-routes/types.ts";


/**
 *  应用路由的基础信息
 * @constructor
 */
function BaseInfoConfPage() {

  const ctx = useContext(AppRoutesContext);
  const outletContext = useLayoutOutletContext();

  const form = useForm<BaseInfoFormValues>({
    resolver: zodResolver(baseInfoFormSchema),
    defaultValues: {priority: 0, status: AppRouteStatusEnum.DRAFT, ...ctx?.baseInfo}
  });

  /**
   * 提交数据
   * @param data
   */
  function onSubmit(data: BaseInfoFormValues) {
    ctx?.setBaseInfo?.(data);
    outletContext.nextPage()
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">基础配置</h3>
        <p className="text-sm text-muted-foreground mt-2">
          应用路由的基本信息
        </p>
      </div>
      <Separator/>

      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField control={form.control}
                       name="name"
                       render={({field}) => (
                         <FormItem>
                           <FormLabel>应用名称</FormLabel>
                           <FormControl>
                             <Input {...field} />
                           </FormControl>
                           <FormMessage/>
                         </FormItem>
                       )}
            />
            <FormField control={form.control}
                       name="describe"
                       render={({field}) => (
                         <FormItem>
                           <FormLabel>应用描述</FormLabel>
                           <FormControl>
                             <Textarea {...field} />
                           </FormControl>
                           <FormDescription>
                             应用描述信息，最多150个字符
                           </FormDescription>
                           <FormMessage/>
                         </FormItem>
                       )}
            />
            <FormField control={form.control}
                       name="priority"
                       render={({field}) => (
                         <FormItem>
                           <FormLabel>应用匹配优先级</FormLabel>
                           <FormControl>
                             <Input {...field} type={"number"}/>
                           </FormControl>
                           <FormDescription>
                             优先级数值越低，优先级越高
                           </FormDescription>
                           <FormMessage/>
                         </FormItem>
                       )}
            />
            <FormField control={form.control}
                       name="status"
                       render={({field}) => (
                         <FormItem>
                           <FormLabel>应用状态</FormLabel>
                           <Select onValueChange={field.onChange}
                                   defaultValue={field.value}>
                             <FormControl>
                               <SelectTrigger>
                                 <SelectValue placeholder="请选择当前应用路由状态"/>
                               </SelectTrigger>
                             </FormControl>
                             <SelectContent>
                               <SelectItem value={AppRouteStatusEnum.ONLINE}>上线</SelectItem>
                               <SelectItem value={AppRouteStatusEnum.OFFLINE}>下线</SelectItem>
                               <SelectItem value={AppRouteStatusEnum.DRAFT}>草稿</SelectItem>
                             </SelectContent>
                           </Select>
                           <FormMessage/>
                         </FormItem>
                       )}
            />
            <Button type="submit">下一项</Button>
          </form>
        </Form>
      </div>
    </div>
  )
}

export default BaseInfoConfPage
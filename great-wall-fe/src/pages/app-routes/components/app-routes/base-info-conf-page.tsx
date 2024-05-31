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
import {AppRoutesContext,} from "@/pages/app-routes/components/app-routes/schema.ts";
import {useContext, useEffect} from "react";
import {useLayoutOutletContext} from "@/pages/app-routes/components/app-routes/layout.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {AppRouteStatusEnum} from "@/constant/api/app-routes/types.ts";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import {baseInfoFormSchema, BaseInfoFormValues} from "@/constant/api/app-routes/schema.ts";

export interface BaseInfoConfPageProps {

  preview?: boolean
}


/**
 *  应用路由的基础信息
 * @constructor
 */
function BaseInfoConfPage(props: BaseInfoConfPageProps) {
  const {
    preview = false
  } = props

  const ctx = useContext(AppRoutesContext);
  const outletContext = useLayoutOutletContext();

  const form = useForm<BaseInfoFormValues>({
    resolver: zodResolver(baseInfoFormSchema),
    defaultValues: {priority: 0, status: AppRouteStatusEnum.ONLINE, ...ctx?.baseInfo},
    disabled: preview
  });

  useEffect(() => {
    if (preview) {
      form.trigger().then()
    }
  }, [preview])

  /**
   * 提交数据
   * @param data
   */
  function onSubmit(data: BaseInfoFormValues) {
    ctx?.setBaseInfo?.(data);
    outletContext.nextPage()
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className={"text-xl"}>基础配置</CardTitle>
        <CardDescription>
          应用路由的基本信息
        </CardDescription>
      </CardHeader>
      <CardContent>
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
                                   defaultValue={field.value}
                                   disabled={field.disabled}
                           >
                             <FormControl>
                               <SelectTrigger>
                                 <SelectValue placeholder="请选择当前应用路由状态"/>
                               </SelectTrigger>
                             </FormControl>
                             <SelectContent>
                               <SelectItem value={AppRouteStatusEnum.ONLINE}>上线</SelectItem>
                               <SelectItem value={AppRouteStatusEnum.OFFLINE}>下线</SelectItem>
                             </SelectContent>
                           </Select>
                           <FormMessage/>
                         </FormItem>
                       )}
            />
            {
              !preview && (
                <Button type="submit">保存</Button>
              )
            }
          </form>
        </Form>
      </CardContent>
    </Card>
  )
}

export default BaseInfoConfPage
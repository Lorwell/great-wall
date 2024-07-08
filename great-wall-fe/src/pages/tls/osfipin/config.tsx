import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ConfigSchemaValues, osfipinConfigSchema, OsfipinConfigSchemaValues} from "@/constant/api/app-tls/schema.ts";
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
import {TlsTypeEnum} from "@/constant/api/app-tls/types.ts";
import useApiRequest from "@/components/hooks/useApiRequest.ts";
import {tlsUpdate} from "@/constant/api/app-tls";
import useFromFieldErrorSpecification from "@/components/hooks/useFromFieldErrorSpecification.ts";
import {useLocation, useNavigate} from "react-router-dom";
import {Input} from "@/components/ui/input.tsx";

/**
 * 来此加密证书
 *
 * @see https://letsencrypt.osfipin.com/
 * @constructor
 */
export default function CustomTls() {
  const navigate = useNavigate();

  const {state} = useLocation();
  const config = state as ConfigSchemaValues | undefined | null;

  const form = useForm<OsfipinConfigSchemaValues>({
    resolver: zodResolver(osfipinConfigSchema),
    defaultValues: {
      type: TlsTypeEnum.Osfipin,
      ...(config?.type === TlsTypeEnum.Osfipin ? config : {})
    }
  });

  const {loading, runAsync} = useApiRequest(tlsUpdate, {manual: true, noticeError: false});
  const specification = useFromFieldErrorSpecification(form);

  /**
   * 提交数据
   * @param data
   */
  async function onSubmit(data: OsfipinConfigSchemaValues) {
    await specification(() => runAsync({config: data}));
    navigate("/manage/tls")
  }

  return (
    <div className={"w-[480px] flex flex-col gap-4 ml-[80px]"}>
      <div className={"text-lg font-bold"}>来此加密</div>
      <a className="text-sm text-muted-foreground" target={"_blank"} href={"https://letsencrypt.osfipin.com/"}>
        https://letsencrypt.osfipin.com/
      </a>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField control={form.control}
                       name="user"
                       render={({field}) => (
                         <FormItem>
                           <FormLabel>账户名</FormLabel>
                           <FormControl>
                             <Input {...field}  />
                           </FormControl>
                           <FormMessage/>
                           <FormDescription>注册的邮箱或者手机号</FormDescription>
                         </FormItem>
                       )}
            />
            <FormField control={form.control}
                       name="autoId"
                       render={({field}) => (
                         <FormItem>
                           <FormLabel>自动申请id</FormLabel>
                           <FormControl>
                             <Input {...field}  />
                           </FormControl>
                           <FormMessage/>
                           <FormDescription>指定证书开启自动重申后，填入对应的自动申请id</FormDescription>
                         </FormItem>
                       )}
            />
            <FormField control={form.control}
                       name="token"
                       render={({field}) => (
                         <FormItem>
                           <FormLabel>接口凭证</FormLabel>
                           <FormControl>
                             <Input {...field}  />
                           </FormControl>
                           <FormMessage/>
                           <FormDescription>在管理界面 - 我的 - API接口页面进行创建Token</FormDescription>
                         </FormItem>
                       )}
            />
            <Button type="submit" loading={loading} className="w-full" variant={"secondary"}>
              提交
            </Button>
          </form>
        </Form>
      </div>
    </div>
  )

}
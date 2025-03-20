import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {ConfigSchemaValues, CustomConfigSchemaValues, customsConfigSchema} from "@/constant/api/app-tls/schema.ts";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";
import {TlsTypeEnum} from "@/constant/api/app-tls/types.ts";
import {Textarea} from "@/components/ui/textarea.tsx";
import useApiRequest from "@/components/hooks/use-api-request.ts";
import {tlsUpdate} from "@/constant/api/app-tls";
import useFromFieldErrorSpecification from "@/components/hooks/use-from-field-error-specification.ts";
import {useLocation, useNavigate} from "react-router-dom";

/**
 * 自定义证书
 * @constructor
 */
export default function CustomTls() {

  const navigate = useNavigate();

  const {state} = useLocation();
  const config = state as ConfigSchemaValues | undefined | null;

  const form = useForm<CustomConfigSchemaValues>({
    resolver: zodResolver(customsConfigSchema),
    defaultValues: {
      type: TlsTypeEnum.Custom,
      ...(config?.type === TlsTypeEnum.Custom ? config : {})
    }
  });

  const {loading, runAsync} = useApiRequest(tlsUpdate, {manual: true, noticeError: false});
  const specification = useFromFieldErrorSpecification(form);

  /**
   * 提交数据
   * @param data
   */
  async function onSubmit(data: CustomConfigSchemaValues) {
    await specification(() => runAsync({config: data}));
    navigate("/manage/tls")
  }

  return (
    <div className={"w-[480px] flex flex-col gap-4 ml-[80px]"}>
      <div className={"text-lg font-bold"}>自定义证书</div>
      <div>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField control={form.control}
                       name="certificate"
                       render={({field}) => (
                         <FormItem>
                           <FormLabel>Cert 证书</FormLabel>
                           <FormControl>
                             <Textarea {...field} rows={8}/>
                           </FormControl>
                           <FormMessage/>
                         </FormItem>
                       )}
            />
            <FormField control={form.control}
                       name="privateKey"
                       render={({field}) => (
                         <FormItem>
                           <FormLabel>Key 密钥</FormLabel>
                           <FormControl>
                             <Textarea {...field} rows={8}/>
                           </FormControl>
                           <FormMessage/>
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
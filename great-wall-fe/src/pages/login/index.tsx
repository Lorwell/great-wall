import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {loginFormSchema, LoginFormValues} from "@/constant/api/login/schema.ts";
import useApiRequest from "@/components/hooks/useApiRequest.ts";
import {login} from "@/constant/api/login";
import useFromFieldErrorSpecification from "@/components/hooks/useFromFieldErrorSpecification.ts";
import {useNavigate} from "react-router-dom";


/**
 * 登录页面
 * @constructor
 */
export default function Login() {
  const navigate = useNavigate();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginFormSchema),
  });

  const {runAsync, loading} = useApiRequest(login, {manual: true, noticeError: false});
  const specification = useFromFieldErrorSpecification(form);

  /**
   * 提交数据
   * @param data
   */
  async function onSubmit(data: LoginFormValues) {
    await specification(() => runAsync(data));

    navigate("/")
  }

  return (
    <div className={"w-full h-screen flex items-center justify-center px-4"}>
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">登录</CardTitle>
          <CardDescription>
            欢迎登录 Great Wall
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormField control={form.control}
                         name="username"
                         render={({field}) => (
                           <FormItem>
                             <FormLabel>账号</FormLabel>
                             <FormControl>
                               <Input {...field} />
                             </FormControl>
                             <FormMessage/>
                           </FormItem>
                         )}
              />
              <FormField control={form.control}
                         name="password"
                         render={({field}) => (
                           <FormItem>
                             <FormLabel>密码</FormLabel>
                             <FormControl>
                               <Input {...field} type={"password"}/>
                             </FormControl>
                             <FormMessage/>
                           </FormItem>
                         )}
              />

              <Button type="submit" loading={loading} className="w-full">
                登录
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  )
}
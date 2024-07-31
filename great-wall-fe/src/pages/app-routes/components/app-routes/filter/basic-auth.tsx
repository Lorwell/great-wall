import FilterCard from "@/pages/app-routes/components/app-routes/filter/filter-card.tsx";
import {Fingerprint} from "lucide-react";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {basicAuthFilterSchema, BasicAuthFilterSchemaValues} from "@/constant/api/app-routes/schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {RouteFilterEnum} from "@/constant/api/app-routes/types.ts";
import {Input} from "@/components/ui/input.tsx";
import {useEffect} from "react";

export interface RoutesProps<T> {
  value?: T,
  onChange?: (value: T) => Promise<boolean | void> | void | boolean
  onRemove?: () => Promise<void> | void
  enable?: boolean
  showDescription?: boolean
}

/**
 *  basic 认证
 * @constructor
 */
export default function BasicAuth(props: RoutesProps<BasicAuthFilterSchemaValues>) {
  const {
    value,
    onChange,
    onRemove,
    enable = false,
    showDescription
  } = props;

  const form = useForm<BasicAuthFilterSchemaValues>({
    resolver: zodResolver(basicAuthFilterSchema),
    defaultValues: {...(value || {}), type: RouteFilterEnum.BasicAuth},
  });

  useEffect(() => {
    form.setValue("username", value?.username || "")
    form.setValue("password", value?.password || "")
  }, [value]);

  /**
   * 提交数据
   * @param data
   */
  async function onSubmit(data: BasicAuthFilterSchemaValues) {
    await onChange?.(data)
  }

  return (
    <FilterCard title={"Basic Auth"}
                icon={<Fingerprint className={"w-6 h-6"}/>}
                description={<Description/>}
                enable={enable}
                showDescription={showDescription}
                onSubmit={async () => {
                  if (!await form.trigger()) return false
                  await form.handleSubmit(onSubmit)()
                }}
                onRemove={onRemove}
    >
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
                           <Input {...field} />
                         </FormControl>
                         <FormMessage/>
                       </FormItem>
                     )}
          />
        </form>
      </Form>
    </FilterCard>
  )
}

function Description() {
  return (
    <div>
      <a className={"text-blue-600"} href={"https://datatracker.ietf.org/doc/html/rfc7235"}>RFC 7235</a>
      &nbsp;HTTP 身份验证
    </div>
  )
}
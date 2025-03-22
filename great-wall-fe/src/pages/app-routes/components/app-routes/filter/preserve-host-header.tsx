import {RoutesProps} from "@/pages/app-routes/components/app-routes/filter/config.tsx";
import {
  preserveHostHeaderFilterSchema,
  PreserveHostHeaderFilterSchemaValues
} from "@/constant/api/app-routes/schema.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RouteFilterEnum} from "@/constant/api/app-routes/types.ts";
import {useEffect} from "react";
import FilterCard from "@/pages/app-routes/components/app-routes/filter/filter-card.tsx";
import {Wrench} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Switch} from "@/components/ui/switch.tsx";

/**
 *  保留 Host 请求头
 * @constructor
 */
export default function PreserveHostHeader(props: RoutesProps<PreserveHostHeaderFilterSchemaValues>) {
  const {
    value,
    onChange,
    onRemove,
    ...rest
  } = props;

  const form = useForm<PreserveHostHeaderFilterSchemaValues>({
    resolver: zodResolver(preserveHostHeaderFilterSchema),
    defaultValues: {...(value || {}), type: RouteFilterEnum.PreserveHostHeader},
    disabled: rest.disabled || rest.enable === "preview"
  });

  useEffect(() => {
    if (!!value) {
      form.setValue("preserve", value.preserve)
    }
  }, [value]);

  /**
   * 提交数据
   * @param data
   */
  async function onSubmit(data: PreserveHostHeaderFilterSchemaValues) {
    await onChange?.(data)
  }

  return (
    <FilterCard {...rest}
                title={"Host 请求头"}
                icon={<Wrench className={"w-6 h-6"}/>}
                category={"请求修改"}
                description={<Description/>}
                onSubmit={async () => {
                  if (!await form.trigger()) return false
                  await form.handleSubmit(onSubmit)()
                }}
                onRemove={onRemove}
    >
      <Form {...form}>
        <form className="space-y-8">
          <FormField control={form.control}
                     name="preserve"
                     render={({field}) => (
                       <FormItem>
                         <FormLabel>是否保留 Host 请求头</FormLabel>
                         <FormControl>
                           <div className={"flex flex-row items-center gap-2 text-sm"}>
                             <span>不保留</span>
                             <Switch disabled={field.disabled}
                                     onBlur={field.onBlur}
                                     className={"!mt-0"}
                                     checked={field.value}
                                     onCheckedChange={field.onChange}
                             />
                             <span>保留</span>
                           </div>
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
    <span>
      转发目标服务时保留 Host 请求头
    </span>
  )
}
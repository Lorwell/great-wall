import {RoutesProps} from "@/pages/app-routes/components/app-routes/filter/config.tsx";
import {slideWindowFilterSchema, SlideWindowFilterSchemaValues} from "@/constant/api/app-routes/schema.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RouteFilterEnum, WindowUnitEnum} from "@/constant/api/app-routes/types.ts";
import {useEffect} from "react";
import FilterCard from "@/pages/app-routes/components/app-routes/filter/filter-card.tsx";
import {Fingerprint} from "lucide-react";
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
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

/**
 *  滑动窗口算法
 * @constructor
 */
export default function SideWindowRequestRateLimiter(props: RoutesProps<SlideWindowFilterSchemaValues>) {
  const {
    value,
    onChange,
    onRemove,
    ...rest
  } = props;

  const form = useForm<SlideWindowFilterSchemaValues>({
    resolver: zodResolver(slideWindowFilterSchema),
    defaultValues: {
      ...(value || {
        window: 1,
        windowUnit: WindowUnitEnum.SECONDS,
        size: 60,
        limit: 10000,
        statusCode: 429
      }),
      type: RouteFilterEnum.SlideWindowRequestRateLimiter
    },
    disabled: rest.disabled || rest.enable === "preview"
  });

  useEffect(() => {
    if (!!value) {
      form.setValue("limit", value.limit)
      form.setValue("window", value.window)
      form.setValue("windowUnit", value.windowUnit)
      form.setValue("size", value.size)
    }
  }, [value]);

  /**
   * 提交数据
   * @param data
   */
  async function onSubmit(data: SlideWindowFilterSchemaValues) {
    await onChange?.(data)
  }

  return (
    <FilterCard {...rest}
                title={"滑动窗口限流"}
                icon={<Fingerprint className={"w-6 h-6"}/>}
                category={"流量控制"}
                description={<Description/>}
                onSubmit={async () => {
                  if (!await form.trigger()) return false
                  await form.handleSubmit(onSubmit)()
                }}
                onRemove={onRemove}
    >
      <Form {...form}>
        <form className="space-y-4">

          <div className={"space-y-2"}>
            <FormLabel>单个窗口间隔时间</FormLabel>
            <div className={"flex flex-row w-full"}>
              <FormField control={form.control}
                         name="window"
                         render={({field}) => (
                           <FormItem className={"flex-auto"}>
                             <FormControl>
                               <Input {...field} type={"number"} min={1}/>
                             </FormControl>
                             <FormMessage/>
                           </FormItem>
                         )}
              />

              <FormField control={form.control}
                         name="windowUnit"
                         render={({field}) => (
                           <FormItem>
                             <FormControl>
                               <Select onValueChange={field.onChange}
                                       defaultValue={field.value}
                                       disabled={field.disabled}
                               >
                                 <FormControl>
                                   <SelectTrigger className="w-[70px]">
                                     <SelectValue/>
                                   </SelectTrigger>
                                 </FormControl>
                                 <SelectContent>
                                   <SelectItem value={WindowUnitEnum.SECONDS}>秒</SelectItem>
                                   <SelectItem value={WindowUnitEnum.MINUTES}>分</SelectItem>
                                   <SelectItem value={WindowUnitEnum.HOURS}>时</SelectItem>
                                 </SelectContent>
                               </Select>
                             </FormControl>
                             <FormMessage/>
                           </FormItem>
                         )}
              />
            </div>
          </div>

          <FormField control={form.control}
                     name="size"
                     render={({field}) => (
                       <FormItem>
                         <FormLabel>窗口数量</FormLabel>
                         <FormControl>
                           <Input {...field} type={"number"} min={1}/>
                         </FormControl>
                         <FormMessage/>
                       </FormItem>
                     )}
          />

          <FormField control={form.control}
                     name="limit"
                     render={({field}) => (
                       <FormItem>
                         <FormLabel>请求量限制</FormLabel>
                         <FormControl>
                           <Input {...field} type={"number"} min={1}/>
                         </FormControl>
                         <FormDescription>
                           即：在任意（单个窗口间隔时间 * 窗口数量）连续的时间维度下请求数量上限为当前值
                         </FormDescription>
                         <FormMessage/>
                       </FormItem>
                     )}
          />

          <FormField control={form.control}
                     name="statusCode"
                     render={({field}) => (
                       <FormItem>
                         <FormLabel>拒绝服务响应结状态码</FormLabel>
                         <FormControl>
                           <Input {...field} type={"number"} min={100} max={999}/>
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
      在任意连续的时间维度下请求数量达到上限后拒绝服务
    </span>
  )
}
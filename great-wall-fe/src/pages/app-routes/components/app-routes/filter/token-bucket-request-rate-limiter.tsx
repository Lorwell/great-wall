import {RoutesProps} from "@/pages/app-routes/components/app-routes/filter/config.tsx";
import {tokenBucketFilterSchema, TokenBucketFilterSchemaValues} from "@/constant/api/app-routes/schema.ts";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RouteFilterEnum} from "@/constant/api/app-routes/types.ts";
import {useEffect} from "react";
import FilterCard from "@/pages/app-routes/components/app-routes/filter/filter-card.tsx";
import {Fingerprint} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";

/**
 *  令牌桶算法
 * @constructor
 */
export default function TokenBucketRequestRateLimiter(props: RoutesProps<TokenBucketFilterSchemaValues>) {
  const {
    value,
    onChange,
    onRemove,
    ...rest
  } = props;

  const form = useForm<TokenBucketFilterSchemaValues>({
    resolver: zodResolver(tokenBucketFilterSchema),
    defaultValues: {
      ...(value || {
        limit: 1000,
        statusCode: 429
      }),
      type: RouteFilterEnum.TokenBucketRequestRateLimiter
    },
    disabled: rest.disabled || rest.enable === "preview"
  });

  useEffect(() => {
    if (!!value) {
      form.setValue("limit", value.limit)
    }
  }, [value]);

  /**
   * 提交数据
   * @param data
   */
  async function onSubmit(data: TokenBucketFilterSchemaValues) {
    await onChange?.(data)
  }

  return (
    <FilterCard {...rest}
                title={"令牌桶限流"}
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
          <FormField control={form.control}
                     name="limit"
                     render={({field}) => (
                       <FormItem>
                         <FormLabel>令牌数量</FormLabel>
                         <FormControl>
                           <Input {...field} type={"number"} min={1}/>
                         </FormControl>
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
      请求需要先获取令牌，未获取到令牌，则拒绝服务
    </span>
  )
}
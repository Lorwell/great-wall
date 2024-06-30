import {Control, FieldPath, FieldValues} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import {HoverCard, HoverCardContent, HoverCardTrigger} from "@/components/ui/hover-card.tsx";
import {CircleHelp} from "lucide-react";
import MultipleSelector from "@/components/custom-ui/multiple-selector.tsx";


export interface RemoteAddrPredicateProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
  control?: Control<TFieldValues>;
  name: TName;
  className?: string
}

/**
 * 路径匹配路由条件
 * @param props
 * @constructor
 */
export default function RemoteAddrPredicate<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: RemoteAddrPredicateProps<TFieldValues, TName>) {
  const {className, ...rest} = props

  return (
    <FormField
      {...rest}
      render={({field}) => {
        const value = field.value?.map((it: string) => ({label: it, value: it}));

        return (
          <FormItem className={className}>
            <div className={"flex flex-row items-center gap-2"}>
              <FormControl>
                <MultipleSelector
                  {...field}
                  value={value}
                  onChange={options => field.onChange(options.map(it => it.value))}
                  creatable
                  placeholder={"RemoteAddr"}
                  hidePlaceholderWhenSelected
                  badgeClassName={"bg-transparent hover:bg-transparent font-normal text-primary text-sm"}
                />
              </FormControl>

              <HoverCard>
                <HoverCardTrigger asChild>
                  <CircleHelp className={"h-4 w-4"}/>
                </HoverCardTrigger>
                <HoverCardContent>
                  <p>
                    RemoteAddr 匹配规则 <br/>
                    IPv4或IPv6字符串， 如 192.168.0.1/16（其中 192.168.0.1 是一个IP地址，16 是一个子网掩码 <br/>
                    如果未指定网络掩码，默认值为32
                  </p>
                </HoverCardContent>
              </HoverCard>
            </div>
            <FormDescription>
              RemoteAddr 匹配
            </FormDescription>
            <FormMessage/>
          </FormItem>
        )
      }}
    />
  )
}
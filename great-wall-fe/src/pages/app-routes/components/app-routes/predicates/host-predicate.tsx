import {Control, FieldPath, FieldValues} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import MultipleSelector from "@/components/custom-ui/multiple-selector.tsx";
import FormHoverDescription from "@/components/custom-ui/form-hover-description.tsx";


export interface HostPredicateProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
  control?: Control<TFieldValues>;
  name: TName;
  className?: string
}

/**
 * host 路由条件
 * @constructor
 */
export default function HostPredicate<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: HostPredicateProps<TFieldValues, TName>) {
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
                  placeholder={"Host"}
                  hidePlaceholderWhenSelected
                  badgeClassName={"bg-transparent hover:bg-transparent font-normal text-primary text-sm"}
                />
              </FormControl>
              <FormHoverDescription>
                <p>
                  Host 匹配规则使用{" "}
                  <a href={"https://ant.apache.org/"}
                     target={"_blank"}
                     className={"underline underline-offset-2"}
                  >
                    Ant
                  </a>
                  {" "} 风格路径模式，如下所示：
                </p>

                <ul>
                  <li>? 匹配一个字符</li>
                  <li>* 匹配零个或多个字符</li>
                  <li>** 匹配路径中的零个或多个层级</li>
                </ul>
              </FormHoverDescription>
            </div>
            <FormDescription>
              Host 匹配
            </FormDescription>
            <FormMessage/>
          </FormItem>
        )
      }}
    />
  )
}



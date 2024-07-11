import {Control, FieldPath, FieldValues} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import MultipleSelector, {Option} from "@/components/custom-ui/multiple-selector.tsx";
import FormHoverDescription from "@/components/custom-ui/form-hover-description";


export interface MethodPredicateProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
  control?: Control<TFieldValues>;
  name: TName;
  className?: string
}

export const options: Option[] = [
  {
    label: "OPTIONS",
    value: "OPTIONS",
  },
  {
    label: "GET",
    value: "GET",
  },
  {
    label: "POST",
    value: "POST",
  },
  {
    label: "PATCH",
    value: "PATCH",
  },
  {
    label: "PUT",
    value: "PUT",
  },
  {
    label: "DELETE",
    value: "DELETE",
  },
]

/**
 * 请求方式路由条件
 * @param props
 * @constructor
 */
export default function MethodPredicate<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: MethodPredicateProps<TFieldValues, TName>) {
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
                  defaultOptions={options}
                  onChange={options => field.onChange(options.map(it => it.value))}
                  creatable
                  hidePlaceholderWhenSelected
                  badgeClassName={"bg-transparent hover:bg-transparent text-primary"}
                />
              </FormControl>
              <FormHoverDescription>
                <p>
                  请求方式匹配规则 <br/>
                  基于指定的请求方式进行路由规则的匹配
                </p>
              </FormHoverDescription>
            </div>
            <FormDescription>
              请求方式匹配
            </FormDescription>
            <FormMessage/>
          </FormItem>
        )
      }}
    />
  )
}
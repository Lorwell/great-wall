import {Control, FieldPath, FieldValues} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {cn} from "@/utils/shadcnUtils.ts";
import FormHoverDescription from "@/components/custom-ui/form-hover-description.tsx";


export interface KVPredicateProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
  control?: Control<TFieldValues>;
  keyName: TName;
  valueName: TName;
  className?: string
  kvType: "Cookie" | "Query" | "Header"
}

/**
 * host 路由条件
 * @constructor
 */
export default function KVPredicate<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: KVPredicateProps<TFieldValues, TName>) {
  const {
    className,
    keyName,
    valueName,
    kvType,
    ...rest
  } = props

  return (
    <div className={cn("flex flex-row space-x-2 items-start", className)}>
      <FormField
        {...rest}
        name={keyName}
        render={({field}) => {
          return (
            <FormItem>
              <FormControl>
                <Input {...field} placeholder={`${kvType} key`}/>
              </FormControl>
              <FormDescription>
                {kvType} 匹配
              </FormDescription>
              <FormMessage/>
            </FormItem>
          )
        }}
      />

      <FormField
        {...rest}
        name={valueName}
        render={({field}) => {
          return (
            <FormItem className={"flex-auto"}>
              <div className={"flex flex-row items-center gap-2"}>
                <FormControl>
                  <Input {...field} placeholder={`${kvType} value`}/>
                </FormControl>
                <FormHoverDescription>
                  <p>
                    {kvType}{" "}匹配规则 <br/>
                    key 是完全匹配，也就是说这个 key 必须存在 <br/>
                    value 使用正则表达式进行匹配
                  </p>
                </FormHoverDescription>
              </div>
              <FormMessage/>
            </FormItem>
          )
        }}
      />

    </div>
  )
}



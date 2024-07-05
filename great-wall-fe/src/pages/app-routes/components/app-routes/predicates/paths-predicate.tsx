import {Control, FieldPath, FieldValues} from "react-hook-form";
import {FormControl, FormDescription, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import MultipleSelector from "@/components/custom-ui/multiple-selector.tsx";
import FormSheetDescription from "@/components/custom-ui/form-sheet-description.tsx";

export interface PathsPredicateProps<TFieldValues extends FieldValues = FieldValues, TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>> {
  control?: Control<TFieldValues>;
  name: TName;
  className?: string
}

/**
 * 路径匹配路由条件
 * @param props
 * @constructor
 */
export default function PathsPredicate<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>(props: PathsPredicateProps<TFieldValues, TName>) {
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
                  placeholder={"Path"}
                  hidePlaceholderWhenSelected
                  badgeClassName={"bg-transparent hover:bg-transparent font-normal text-primary text-sm"}
                />
              </FormControl>

              <FormSheetDescription title={"路径规则"}>
                <article className="prose">
                  <p>
                    使用以下规则匹配 URL 路径
                  </p>
                  <ul>
                    <li>? 匹配一个字符</li>
                    <li>* 匹配路径段中的零个或多个字符</li>
                    <li>** 匹配零个或多个 路径段 ，直到路径结束</li>
                    <li>&#123;spring&#125; 匹配 路径段 并将其捕获为名为“spring”的变量</li>
                    <li>&#123;spring:[a-z]+&#125; 将正则表达 [a-z]+
                      式与路径段进行匹配，并为其捕获名为“spring”的路径变量
                    </li>
                    <li>&#123;*spring&#125; 匹配零个或多个 路径段 ，直到路径的末尾，并将其捕获为名为“spring”的变量
                    </li>
                  </ul>
                  <b>
                    注意：** 仅在模式的末尾受支持。例如 /pages/&#123;**&#125;，是有效的，
                    但 /pages/&#123;**&#125;/details 是无效的，这同样适用于捕获变体 &#123;*spring&#125;
                  </b>
                  <p>
                    <b>例子</b>
                  </p>
                  <ul>
                    <li>/pages/t?st.html — 匹配 /pages/test.html，/pages/tXst.html 但不匹配 /pages/toast.html
                    </li>
                    <li>/resources/*.png— 匹配目录中resources的所有.png文件</li>
                    <li>/resources/** — 匹配路径下 /resources/ 的所有文件，包括 /resources/image.png 和
                      /resources/css/spring.css
                    </li>
                    <li>/resources/&#123;*path&#125; — 匹配 和 下的所有文件 /resources/， /resources并在名为
                      “path”
                      的变量中捕获它们的相对路径
                    </li>
                    <li>/resources/image.png 将与 “path” 匹配 → “/image.png”，并将 /resources/css/spring.css 与
                      “path”
                      匹配
                      → “/css/spring.css”
                    </li>
                    <li>/resources/&#123;filename:\\w+&#125;.dat将匹配
                      /resources/spring.dat该值"spring"filename并将其分配给变量
                    </li>
                  </ul>
                </article>
              </FormSheetDescription>
            </div>
            <FormDescription>
              路径匹配
            </FormDescription>
            <FormMessage/>
          </FormItem>
        )
      }}
    />
  )
}
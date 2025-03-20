import {RoutesProps} from "@/pages/app-routes/components/app-routes/filter/config.tsx";
import {
  addResponseHeadersFilterSchema,
  AddResponseHeadersFilterSchemaValues
} from "@/constant/api/app-routes/schema.ts";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RouteFilterEnum} from "@/constant/api/app-routes/types.ts";
import {useEffect} from "react";
import FilterCard from "@/pages/app-routes/components/app-routes/filter/filter-card.tsx";
import {CirclePlus, Fingerprint, Trash2} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import {cn} from "@/lib/shadcnUtils.ts";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";

/**
 * 添加响应头
 * @constructor
 */
export default function AddResponseHeaders(props: RoutesProps<AddResponseHeadersFilterSchemaValues>) {
  const {
    value,
    onChange,
    onRemove,
    ...rest
  } = props;

  const form = useForm<AddResponseHeadersFilterSchemaValues>({
    resolver: zodResolver(addResponseHeadersFilterSchema),
    defaultValues: {...(value || {headers: [{name: "", value: ""}]}), type: RouteFilterEnum.AddResponseHeaders},
    disabled: rest.disabled || rest.enable === "preview"
  });

  const {
    fields,
    append: fieldsAppend,
    remove: fieldsRemove,
  } = useFieldArray({
    control: form.control,
    name: "headers",
  });

  useEffect(() => {
    if (!!value) {
      form.setValue("headers", value.headers)
    }
  }, [value]);

  /**
   * 提交数据
   * @param data
   */
  async function onSubmit(data: AddResponseHeadersFilterSchemaValues) {
    await onChange?.(data)
  }

  return (
    <FilterCard {...rest}
                title={"添加响应头"}
                icon={<Fingerprint className={"w-6 h-6"}/>}
                category={"请求修改"}
                description={<Description/>}
                onSubmit={async () => {
                  if (!await form.trigger()) return false
                  await form.handleSubmit(onSubmit)()
                }}
                onRemove={onRemove}
    >
      <Form {...form}>
        <form className="space-y-4">
          {
            fields.map((item, index) => {
              return (
                <div key={item.id} className={cn("flex flex-row space-x-2 items-start")}>
                  <FormField control={form.control}
                             name={`headers.${index}.name`}
                             render={({field}) => {
                               return (
                                 <FormItem>
                                   <FormControl>
                                     <Input {...field} placeholder={"Header Key"}/>
                                   </FormControl>
                                   <FormMessage/>
                                 </FormItem>
                               )
                             }}
                  />

                  <FormField control={form.control}
                             name={`headers.${index}.value`}
                             render={({field}) => {
                               return (
                                 <FormItem className={"flex-auto"}>
                                   <div className={"flex flex-row items-center gap-2"}>
                                     <FormControl>
                                       <Input {...field} placeholder={"Header Value"}/>
                                     </FormControl>
                                   </div>
                                   <FormMessage/>
                                 </FormItem>
                               )
                             }}
                  />

                  <div className={"pt-1 flex flex-row items-center gap-1"}>
                    <Button variant="outline"
                            size={"icon"}
                            className={"h-8 w-8"}
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              fieldsAppend({name: "", value: ""})
                            }}
                    >
                      <CirclePlus className={cn("cursor-pointer h-5 w-5")}/>
                    </Button>

                    <Button variant="outline"
                            size={"icon"}
                            className={"h-8 w-8"}
                            disabled={fields.length <= 1}
                            onClick={(event) => {
                              event.preventDefault();
                              event.stopPropagation();
                              fieldsRemove(index)
                            }}
                    >
                      <Trash2 className={"h-5 w-5"}/>
                    </Button>
                  </div>
                </div>
              )
            })
          }
        </form>
      </Form>
    </FilterCard>
  )
}

function Description() {
  return (
    <span>
      添加返回的响应头
    </span>
  )
}
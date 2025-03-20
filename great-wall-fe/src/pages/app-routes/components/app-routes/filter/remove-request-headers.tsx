import {RoutesProps} from "@/pages/app-routes/components/app-routes/filter/config.tsx";
import {
  removeRequestHeadersFilterSchema,
  RemoveRequestHeadersFilterSchemaValues
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
 * 删除请求头
 * @constructor
 */
export default function RemoveRequestHeaders(props: RoutesProps<RemoveRequestHeadersFilterSchemaValues>) {
  const {
    value,
    onChange,
    onRemove,
    ...rest
  } = props;

  const form = useForm<RemoveRequestHeadersFilterSchemaValues>({
    resolver: zodResolver(removeRequestHeadersFilterSchema),
    defaultValues: {...(value || {headerNames: [{value: ""}]}), type: RouteFilterEnum.RemoveRequestHeaders},
    disabled: rest.disabled || rest.enable === "preview"
  });

  const {
    fields,
    append: fieldsAppend,
    remove: fieldsRemove,
  } = useFieldArray({
    control: form.control,
    name: "headerNames",
  });

  useEffect(() => {
    if (!!value) {
      form.setValue("headerNames", value.headerNames)
    }
  }, [value]);

  /**
   * 提交数据
   * @param data
   */
  async function onSubmit(data: RemoveRequestHeadersFilterSchemaValues) {
    await onChange?.(data)
  }

  return (
    <FilterCard {...rest}
                title={"删除请求头"}
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
                             name={`headerNames.${index}.value`}
                             render={({field}) => {
                               return (
                                 <FormItem className={"flex-auto"}>
                                   <FormControl>
                                     <Input {...field} placeholder={"Header Key"}/>
                                   </FormControl>
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
                              fieldsAppend({value: ""})
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
      删除转发携带的请求头
    </span>
  )
}
import {RoutesProps} from "@/pages/app-routes/components/app-routes/filter/config.tsx";
import {
  addRequestQueryParametersFilterSchema,
  AddRequestQueryParametersFilterSchemaValues
} from "@/constant/api/app-routes/schema.ts";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {RouteFilterEnum} from "@/constant/api/app-routes/types.ts";
import {useEffect} from "react";
import FilterCard from "@/pages/app-routes/components/app-routes/filter/filter-card.tsx";
import {CirclePlus, Fingerprint, Trash2} from "lucide-react";
import {Form, FormControl, FormField, FormItem, FormMessage} from "@/components/ui/form.tsx";
import {cn} from "@/utils/shadcnUtils.ts";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";

/**
 * 添加请求查询参数
 * @constructor
 */
export default function AddRequestQueryParameters(props: RoutesProps<AddRequestQueryParametersFilterSchemaValues>) {
  const {
    value,
    onChange,
    onRemove,
    ...rest
  } = props;

  const form = useForm<AddRequestQueryParametersFilterSchemaValues>({
    resolver: zodResolver(addRequestQueryParametersFilterSchema),
    defaultValues: {...(value || {params: [{name: "", value: ""}]}), type: RouteFilterEnum.AddRequestQueryParameters},
    disabled: rest.disabled || rest.enable === "preview"
  });

  const {
    fields,
    append: fieldsAppend,
    remove: fieldsRemove,
  } = useFieldArray({
    control: form.control,
    name: "params",
  });

  useEffect(() => {
    if (!!value) {
      form.setValue("params", value.params)
    }
  }, [value]);

  /**
   * 提交数据
   * @param data
   */
  async function onSubmit(data: AddRequestQueryParametersFilterSchemaValues) {
    await onChange?.(data)
  }

  return (
    <FilterCard {...rest}
                title={"添加查询参数"}
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
                             name={`params.${index}.name`}
                             render={({field}) => {
                               return (
                                 <FormItem>
                                   <FormControl>
                                     <Input {...field} placeholder={"Query Params Key"}/>
                                   </FormControl>
                                   <FormMessage/>
                                 </FormItem>
                               )
                             }}
                  />

                  <FormField control={form.control}
                             name={`params.${index}.value`}
                             render={({field}) => {
                               return (
                                 <FormItem className={"flex-auto"}>
                                   <div className={"flex flex-row items-center gap-2"}>
                                     <FormControl>
                                       <Input {...field} placeholder={"Query Params Value"}/>
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
      添加转发携带的请求查询参数
    </span>
  )
}
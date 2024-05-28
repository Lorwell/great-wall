import {forwardRef, useContext} from "react";
import {
  AppRoutesContext,
  predicatesFormSchema,
  PredicatesFormValues
} from "@/pages/app-routes/components/app-routes/schema.ts";
import {useLayoutOutletContext} from "@/pages/app-routes/components/app-routes/layout.tsx";
import {Controller, useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Separator} from "@/components/ui/separator.tsx";
import {Form} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";
import RoutePredicatesPlusOptions from "@/pages/app-routes/components/app-routes/route-predicates-plus-options.tsx";
import {PredicateTypeEnum, RoutePredicateOperatorEnum} from "@/constant/api/app-routes/types.ts";
import HostPredicate from "@/pages/app-routes/components/app-routes/predicates/host-predicate.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";

/**
 * 路由条件
 * @constructor
 */
const PredicatesConfPage = forwardRef(() => {
  const ctx = useContext(AppRoutesContext);
  const outletContext = useLayoutOutletContext();

  const form = useForm<PredicatesFormValues>({
    resolver: zodResolver(predicatesFormSchema),
    defaultValues: {...ctx?.predicates}
  });

  const {fields, append, prepend, remove, swap, move, insert} = useFieldArray({
    control: form.control,
    name: "predicates",
  });

  /**
   * 提交数据
   * @param data
   */
  function onSubmit(data: PredicatesFormValues) {
    console.log(data)
    ctx?.setPredicates?.(data);
    outletContext.nextPage()
  }

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium">路由条件</h3>
        <p className="text-sm text-muted-foreground mt-2">
          匹配请求的路由条件，只有满足条件的才会进行路由请求转发
        </p>
        <p className="text-sm text-muted-foreground mt-2">
          需要注意的是：路由匹配条件自上而下进行匹配
        </p>
      </div>
      <Separator/>

      <div className={"flex flex-col space-y-4"}>
        <RoutePredicatesPlusOptions onAddHostPredicate={() => {
          append({
            operator: RoutePredicateOperatorEnum.AND,
            predicate: {
              type: PredicateTypeEnum.Host,
              value: ""
            }
          })
        }}
        />

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">

            {
              fields.map((fieldValue, index) => {
                return (
                  <div key={fieldValue.id} className={"flex flex-row space-x-2"}>
                    <Select defaultValue={RoutePredicateOperatorEnum.AND}
                            {...form.register(`predicates.${index}.operator`, {required: true})}
                    >
                      <SelectTrigger className={"w-20"}>
                        <SelectValue placeholder="1"/>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={RoutePredicateOperatorEnum.AND}>与</SelectItem>
                        <SelectItem value={RoutePredicateOperatorEnum.OR}>或</SelectItem>
                      </SelectContent>
                    </Select>

                    <Controller key={fieldValue.id}
                                name={`predicates.${index}.predicate`}
                                render={({field}) => {
                                  const type = fieldValue.predicate.type;
                                  switch (type) {
                                    case PredicateTypeEnum.Cookie:
                                      break;
                                    case PredicateTypeEnum.Header:
                                      break;
                                    case PredicateTypeEnum.Host:
                                      // @ts-ignore
                                      return (<HostPredicate {...field}/>)
                                    case PredicateTypeEnum.Method:
                                      break;
                                    case PredicateTypeEnum.Path:
                                      break;
                                    case PredicateTypeEnum.Query:
                                      break;
                                    case PredicateTypeEnum.RemoteAddr:
                                      break;
                                  }
                                  return (<></>)
                                }}
                                control={form.control}
                    />
                  </div>
                )
              })
            }

            <Button type="submit">下一项</Button>
          </form>
        </Form>
      </div>
    </div>
  )
})

export default PredicatesConfPage
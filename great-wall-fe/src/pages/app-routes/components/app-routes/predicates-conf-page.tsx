import {useEffect} from "react";
import {useLayoutOutletContext} from "@/pages/app-routes/components/app-routes/layout.tsx";
import {Control, FieldPath, FieldValues, useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";
import RoutePredicatesPlusOptions from "@/pages/app-routes/components/app-routes/route-predicates-plus-options.tsx";
import {PredicateTypeEnum, RoutePredicateOperatorEnum} from "@/constant/api/app-routes/types.ts";
import HostPredicate from "@/pages/app-routes/components/app-routes/predicates/host-predicate.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import {cn} from "@/lib/shadcnUtils.ts";
import {CirclePlus, MoveDown, MoveUp, Trash2} from "lucide-react";
import {Card, CardContent, CardDescription, CardTitle} from "@/components/ui/card";
import {CardHeader} from "@/components/ui/card.tsx";
import MethodPredicate from "@/pages/app-routes/components/app-routes/predicates/method-predicate.tsx";
import KVPredicate from "@/pages/app-routes/components/app-routes/predicates/kv-predicate.tsx";
import PathsPredicate from "@/pages/app-routes/components/app-routes/predicates/paths-predicate.tsx";
import RemoteAddrPredicate from "@/pages/app-routes/components/app-routes/predicates/remote-addr-predicate.tsx";
import {predicatesFormSchema, PredicatesFormValues} from "@/constant/api/app-routes/schema.ts";
import {useRecoilState} from "recoil";
import {appRoutesDataOptionsState} from "@/pages/app-routes/components/app-routes/store.ts";
import DurationInput from "@/components/custom-ui/duration-input.tsx";
import FormHoverDescription from "@/components/custom-ui/form-hover-description.tsx";

export interface PredicatesConfPageProps {

  preview?: boolean
}


/**
 * 路由条件
 * @constructor
 */
function PredicatesConfPage(props: PredicatesConfPageProps) {
  const {
    preview = false
  } = props

  const [appRoutesDataOptions, setAppRoutesDataOptions] = useRecoilState(appRoutesDataOptionsState);
  const outletContext = useLayoutOutletContext();

  const form = useForm<PredicatesFormValues>({
    resolver: zodResolver(predicatesFormSchema),
    defaultValues: {
      ...{
        predicates: [{
          operator: RoutePredicateOperatorEnum.AND,
          predicate: {
            type: PredicateTypeEnum.Host,
            patterns: []
          }
        }],
        targetConfig: {
          connectTimeout: "PT3S",
          urls: [{
            url: "",
            weight: 1
          }]
        }
      }, ...appRoutesDataOptions.predicates
    },
    disabled: preview
  });

  const {
    fields: predicatesFields,
    append: predicatesAppend,
    swap: predicatesSwap,
    remove: predicatesRemove,
  } = useFieldArray({
    control: form.control,
    name: "predicates",
  });

  const {
    fields: urlsFields,
    append: urlsAppend,
    remove: urlsRemove
  } = useFieldArray({
    control: form.control,
    name: "targetConfig.urls",
  });

  useEffect(() => {
    if (preview) {
      form.trigger().then()
    }
  }, [preview])

  /**
   * 提交数据
   * @param data
   */
  function onSubmit(data: PredicatesFormValues) {
    setAppRoutesDataOptions({...appRoutesDataOptions, predicates: data})
    outletContext.nextPage()
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">

        <Card>
          <CardHeader>
            <CardTitle className={"flex flex-row items-center text-xl"}>
              <span>匹配条件</span>
              <RoutePredicatesPlusOptions
                disabled={preview}
                onAddPredicate={(predicate) => {
                  predicatesAppend({
                    operator: RoutePredicateOperatorEnum.AND,
                    predicate: predicate
                  })
                }}
              />
            </CardTitle>
            <CardDescription>
              匹配请求的路由条件，只有满足条件的才会进行路由请求转发 <br/>
              需要注意的是：路由匹配条件自上而下进行匹配
            </CardDescription>
          </CardHeader>
          <CardContent className={"space-y-2"}>
            {
              predicatesFields.map((predicatesField, index) => {
                const type = predicatesField.predicate.type;

                return (
                  <div key={predicatesField.id} className={"flex flex-row space-x-2 items-start"}>
                    <OperatorFormField control={form.control}
                                       name={`predicates.${index}.operator`}
                    />

                    {
                      PredicateTypeEnum.Host === type && (
                        <HostPredicate control={form.control}
                                       name={`predicates.${index}.predicate.patterns`}
                                       className={"flex-auto"}
                        />
                      )
                    }

                    {
                      PredicateTypeEnum.Method === type && (
                        <MethodPredicate control={form.control}
                                         name={`predicates.${index}.predicate.methods`}
                                         className={"flex-auto"}
                        />
                      )
                    }

                    {
                      PredicateTypeEnum.Cookie === type && (
                        <KVPredicate control={form.control}
                                     kvType={"Cookie"}
                                     keyName={`predicates.${index}.predicate.name`}
                                     valueName={`predicates.${index}.predicate.regexp`}
                                     className={"flex-auto"}
                        />
                      )
                    }

                    {
                      PredicateTypeEnum.Query === type && (
                        <KVPredicate control={form.control}
                                     kvType={"Query"}
                                     keyName={`predicates.${index}.predicate.name`}
                                     valueName={`predicates.${index}.predicate.regexp`}
                                     className={"flex-auto"}
                        />
                      )
                    }

                    {
                      PredicateTypeEnum.Header === type && (
                        <KVPredicate control={form.control}
                                     kvType={"Header"}
                                     keyName={`predicates.${index}.predicate.name`}
                                     valueName={`predicates.${index}.predicate.regexp`}
                                     className={"flex-auto"}
                        />
                      )
                    }

                    {
                      PredicateTypeEnum.Path === type && (
                        <PathsPredicate control={form.control}
                                        name={`predicates.${index}.predicate.patterns`}
                                        className={"flex-auto"}
                        />
                      )
                    }

                    {
                      PredicateTypeEnum.RemoteAddr === type && (
                        <RemoteAddrPredicate control={form.control}
                                             name={`predicates.${index}.predicate.sources`}
                                             className={"flex-auto"}
                        />
                      )
                    }

                    <div className={"flex flex-row space-x-2 items-center mt-1"}>
                      <Button variant="outline"
                              size={"icon"}
                              className={"h-8 w-8"}

                              disabled={index === 0}
                              onClick={() => predicatesSwap(index, index - 1)}
                      >
                        <MoveUp className={"h-5 w-5"}/>
                      </Button>
                      <Button variant="outline"
                              size={"icon"}
                              className={"h-8 w-8"}

                              disabled={index === (predicatesFields.length - 1)}
                              onClick={() => predicatesSwap(index, index + 1)}
                      >
                        <MoveDown className={"h-5 w-5"}/>
                      </Button>
                      <Button variant="outline"
                              size={"icon"}
                              className={"h-8 w-8"}

                              disabled={predicatesFields.length <= 1}
                              onClick={() => predicatesRemove(index)}
                      >
                        <Trash2 className={"h-5 w-5"}/>
                      </Button>
                    </div>
                  </div>
                )
              })
            }
          </CardContent>
        </Card>


        <Card>
          <CardHeader>
            <CardTitle className={"flex flex-row items-center text-xl"}>
              <span>目标服务</span>
              <Button variant={"outline"} size={"icon"} disabled={preview}
                      onClick={() => urlsAppend({url: "", weight: 1})}
              >
                <CirclePlus className={cn("cursor-pointer h-5 w-5")}/>
              </Button>
            </CardTitle>
            <CardDescription>
              路由条件匹配成功，将把请求转发到以下目标服务上 <br/>
              每个 URL 都会设置一个权重值，权重计算方式为：当前权重值 / 所有权重值之和 = 当前 URL 的权重的百分比
            </CardDescription>
          </CardHeader>
          <CardContent className={"flex flex-col space-y-2"}>
            {
              urlsFields.map((uriField, index) => {

                return (
                  <div key={uriField.id} className={"flex flex-row space-x-2 items-start"}>

                    <UrlFormField control={form.control}
                                  name={`targetConfig.urls.${index}.url`}
                                  className={"flex-auto"}
                    />

                    <WeightFormField control={form.control}
                                     name={`targetConfig.urls.${index}.weight`}
                                     className={"w-20"}
                    />

                    <div className={"flex flex-row space-x-2 items-center mt-1"}>
                      <Button variant="outline"
                              size={"icon"}
                              className={"h-8 w-8"}

                              disabled={urlsFields.length <= 1}
                              onClick={() => urlsRemove(index)}
                      >
                        <Trash2 className={"h-5 w-5"}/>
                      </Button>
                    </div>
                  </div>
                )
              })
            }

            <FormField control={form.control}
                       name="targetConfig.connectTimeout"
                       render={({field}) => (
                         <FormItem className={"flex flex-row gap-2 items-center"}>
                           <FormLabel>连接超时时间：</FormLabel>
                           <FormControl>
                             <DurationInput {...field} />
                           </FormControl>
                           <FormMessage/>
                         </FormItem>
                       )}
            />

            <FormField control={form.control}
                       name="targetConfig.responseTimeout"
                       render={({field}) => (
                         <FormItem>
                           <div className={"flex flex-row gap-2 items-center"}>
                             <FormLabel>响应超时时间：</FormLabel>
                             <FormControl>
                               <DurationInput {...field} />
                             </FormControl>
                             <FormHoverDescription>
                               可以为空，表示未不超时
                             </FormHoverDescription>
                           </div>
                           <FormMessage/>
                         </FormItem>
                       )}
            />
          </CardContent>
        </Card>

        {
          !preview && (
            <Button type="submit">保存</Button>
          )
        }
      </form>
    </Form>
  )
}

/**
 * url表单字段
 * @constructor
 */
function UrlFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({control, name, className}: { control: Control<TFieldValues>, name: TName, className?: string }) {
  return (
    <FormField control={control}
               name={name}
               render={({field}) => (
                 <FormItem className={className}>
                   <FormControl>
                     <Input {...field} placeholder={"目标服务 URL"}/>
                   </FormControl>
                   <FormMessage/>
                 </FormItem>
               )}
    />
  )
}

/**
 * weight表单字段
 * @constructor
 */
function WeightFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({control, name, className}: { control: Control<TFieldValues>, name: TName, className?: string }) {
  return (
    <FormField control={control}
               name={name}
               render={({field}) => (
                 <FormItem className={className}>
                   <FormControl>
                     <Input {...field} type={"number"} min={1} max={100} placeholder={"权重"}/>
                   </FormControl>
                   <FormMessage/>
                 </FormItem>
               )}
    />
  )
}

/**
 * 操作符表单字段
 * @constructor
 */
function OperatorFormField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({control, name, className}: { control: Control<TFieldValues>, name: TName, className?: string }) {
  return (
    <FormField control={control}
               name={name}
               render={({field}) => (
                 <FormItem>
                   <Select onValueChange={field.onChange}
                           defaultValue={field.value || RoutePredicateOperatorEnum.AND}
                   >
                     <FormControl>
                       <SelectTrigger className={cn("w-20", className)}>
                         <SelectValue placeholder="1"/>
                       </SelectTrigger>
                     </FormControl>
                     <SelectContent>
                       <SelectItem value={RoutePredicateOperatorEnum.AND}>与</SelectItem>
                       <SelectItem value={RoutePredicateOperatorEnum.OR}>或</SelectItem>
                     </SelectContent>
                   </Select>
                   <FormMessage/>
                 </FormItem>
               )}
    />
  )
}

export default PredicatesConfPage
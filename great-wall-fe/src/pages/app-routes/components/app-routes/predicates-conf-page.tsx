import {useEffect} from "react";
import {useLayoutOutletContext} from "@/pages/app-routes/components/app-routes/layout.tsx";
import {Control, FieldPath, FieldValues, useFieldArray, useForm, UseFormReturn, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from "@/components/ui/form.tsx";
import {Button} from "@/components/ui/button.tsx";
import RoutePredicatesPlusOptions from "@/pages/app-routes/components/app-routes/route-predicates-plus-options.tsx";
import {PredicateTypeEnum, RoutePredicateOperatorEnum, RouteTargetEnum} from "@/constant/api/app-routes/types.ts";
import HostPredicate from "@/pages/app-routes/components/app-routes/predicates/host-predicate.tsx";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {Input} from "@/components/ui/input.tsx";
import {cn} from "@/lib/shadcnUtils.ts";
import {ChevronsUpDown, CirclePlus, MoveDown, MoveUp, Trash2} from "lucide-react";
import {Card, CardContent, CardDescription, CardTitle} from "@/components/ui/card";
import {CardHeader} from "@/components/ui/card.tsx";
import MethodPredicate from "@/pages/app-routes/components/app-routes/predicates/method-predicate.tsx";
import KVPredicate from "@/pages/app-routes/components/app-routes/predicates/kv-predicate.tsx";
import PathsPredicate from "@/pages/app-routes/components/app-routes/predicates/paths-predicate.tsx";
import RemoteAddrPredicate from "@/pages/app-routes/components/app-routes/predicates/remote-addr-predicate.tsx";
import {
  predicatesFormSchema,
  PredicatesFormValues,
  TargetConfigSchemaValues
} from "@/constant/api/app-routes/schema.ts";
import {useRecoilState, useRecoilValue} from "recoil";
import {appRoutesDataOptionsState} from "@/pages/app-routes/components/app-routes/store.ts";
import DurationInput from "@/components/custom-ui/duration-input.tsx";
import FormHoverDescription from "@/components/custom-ui/form-hover-description.tsx";
import useApiRequest from "@/components/hooks/use-api-request.ts";
import {staticResourcesList} from "@/constant/api/static-resources";
import LoadingBlock from "@/components/custom-ui/loading-block.tsx";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";

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
          type: RouteTargetEnum.Urls,
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

  const targetConfigType = useWatch({
    control: form.control,
    name: "targetConfig.type",
  })

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 max-w-4xl">

        <PredicatesCard form={form} preview={preview}/>

        {targetConfigType === RouteTargetEnum.Urls && (
          <RouteUrlsTargetConfigCard form={form} preview={preview}/>
        )}

        {targetConfigType === RouteTargetEnum.StaticResources && (
          <RouteStaticResourcesTargetConfigCard form={form} preview={preview}/>
        )}

        {
          !preview && (
            <Button type="submit">下一步</Button>
          )
        }
      </form>
    </Form>
  )
}

/**
 * 路由条件卡片
 * @constructor
 */
function PredicatesCard(
  {
    form,
    preview
  }: { form: UseFormReturn<PredicatesFormValues, any, any>, preview: boolean }
) {

  const {
    fields: predicatesFields,
    append: predicatesAppend,
    swap: predicatesSwap,
    remove: predicatesRemove,
  } = useFieldArray({
    control: form.control,
    name: "predicates",
  });

  return (
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
  )
}

function RouteTargetConfigTypeSelect(
  {
    type,
    form,
    preview
  }: { type: RouteTargetEnum, form: UseFormReturn<PredicatesFormValues, any, any>, preview: boolean }) {

  const appRoutesDataOptions = useRecoilValue(appRoutesDataOptionsState);

  function handleChange(value: RouteTargetEnum) {
    if (type !== value) {

      const sourceTargetConfig = appRoutesDataOptions.predicates?.targetConfig;
      const sourceType = sourceTargetConfig?.type;

      let targetConfig: Partial<TargetConfigSchemaValues>
      switch (value) {
        case RouteTargetEnum.Urls:
          targetConfig = {
            type: RouteTargetEnum.Urls,
            connectTimeout: "PT3S",
            urls: [{
              url: "",
              weight: 1
            }]
          }
          break;
        case RouteTargetEnum.StaticResources:
          targetConfig = {
            type: RouteTargetEnum.StaticResources,
            id: undefined,
            index: "index.html",
            tryfile404: "index.html"
          }
          break;
        default:
          throw new Error(`未知的额类型：${value}`)
      }

      form.setValue("targetConfig",
        // @ts-ignore
        {...targetConfig, ...(sourceType === value ? sourceTargetConfig : {})},
        {
          shouldValidate: true
        }
      )

    }
  }

  return (
    <div className={"flex items-center gap-2"}>
      <div>
        路由目标
      </div>
      <Select
        value={type}
        onValueChange={handleChange}
        disabled={preview}
      >
        <SelectTrigger
          className={"w-fit gap-2 m-1"}
        >
          <>
            <ChevronsUpDown className={"size-4"}/>
            <SelectValue placeholder="请选择路由目标类型"/>
          </>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value={RouteTargetEnum.Urls}>Urls 目标地址</SelectItem>
          <SelectItem value={RouteTargetEnum.StaticResources}>关联静态资源</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}

/**
 * url地址类型目标配置
 * @constructor
 */
function RouteUrlsTargetConfigCard(
  {
    form,
    preview
  }: { form: UseFormReturn<PredicatesFormValues, any, any>, preview: boolean }) {
  const {
    fields: urlsFields,
    append: urlsAppend,
    remove: urlsRemove
  } = useFieldArray({
    control: form.control,
    name: "targetConfig.urls",
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle className={"flex flex-row items-center text-xl"}>
          <RouteTargetConfigTypeSelect type={RouteTargetEnum.Urls} form={form} preview={preview}/>
          <Button
            variant={"outline"}
            size={"icon"}
            className={"border-none"}
            disabled={preview}
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

        {urlsFields.map((uriField, index) => {
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
        })}

        <FormField
          control={form.control}
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

        <FormField
          control={form.control}
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
  )
}

/**
 * 静态资源类型目标配置
 * @constructor
 */
function RouteStaticResourcesTargetConfigCard(
  {
    form,
    preview
  }: { form: UseFormReturn<PredicatesFormValues, any, any>, preview: boolean }) {

  const {
    data: staticResourcesData,
    loading: staticResourcesLoading
  } = useApiRequest(staticResourcesList);

  return (
    <Card>
      <CardHeader>
        <CardTitle className={"flex flex-row items-center text-xl"}>
          <RouteTargetConfigTypeSelect type={RouteTargetEnum.StaticResources} form={form} preview={preview}/>
        </CardTitle>
        <CardDescription>
          路由条件匹配成功，将把请求路径映射为指定的静态资源路径，读取文件内容并且返回<br/>
        </CardDescription>
      </CardHeader>
      <CardContent className={"flex flex-col space-y-2"}>
        <LoadingBlock loading={staticResourcesLoading}>
          <FormField control={form.control}
                     name="targetConfig.id"
                     render={({field}) => (
                       <FormItem>
                         <FormLabel>静态资源</FormLabel>
                         <Select
                           onValueChange={(value) => field.onChange(Number(value))}
                           defaultValue={String(field.value)}
                           disabled={field.disabled}
                         >
                           <FormControl>
                             <SelectTrigger>
                               <SelectValue placeholder="请选择关联的静态资源"/>
                             </SelectTrigger>
                           </FormControl>
                           <SelectContent>
                             {staticResourcesData?.records.map(it => {
                               return (
                                 <Tooltip key={it.id}>
                                   <TooltipTrigger asChild>
                                     <SelectItem value={String(it.id)}>{it.name}</SelectItem>
                                   </TooltipTrigger>
                                   <TooltipContent>
                                     <div className={"text-base font-bold mb-2"}>名称： {it.name}</div>
                                     <div className={"text-sm"}>描述： {it.describe || "暂无"}</div>
                                   </TooltipContent>
                                 </Tooltip>
                               )
                             })}
                           </SelectContent>
                         </Select>
                         <FormMessage/>
                       </FormItem>
                     )}
          />

          <FormField control={form.control}
                     name="targetConfig.index"
                     render={({field}) => (
                       <FormItem>
                         <FormLabel>首页</FormLabel>
                         <FormControl>
                           <Input {...field}  />
                         </FormControl>
                         <FormDescription>
                           路由匹配默认页面
                         </FormDescription>
                         <FormMessage/>
                       </FormItem>
                     )}
          />

          <FormField control={form.control}
                     name="targetConfig.tryfile404"
                     render={({field}) => (
                       <FormItem>
                         <FormLabel>404时使用指定页面返回</FormLabel>
                         <FormControl>
                           <Input {...field} value={field.value || ""}/>
                         </FormControl>
                         <FormDescription>
                           路由请求404时将使用指定的页面返回
                         </FormDescription>
                         <FormMessage/>
                       </FormItem>
                     )}
          />
        </LoadingBlock>
      </CardContent>
    </Card>
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
                   <Select
                     onValueChange={field.onChange}
                     defaultValue={field.value || RoutePredicateOperatorEnum.AND}
                   >
                     <FormControl>
                       <SelectTrigger className={cn("w-20", className)}>
                         <SelectValue/>
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
import {useFieldArray, UseFieldArrayReturn, useForm} from "react-hook-form";
import {FilterFormValues, filtersSchema} from "@/constant/api/app-routes/schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Form} from "@/components/ui/form.tsx";
import {useRecoilState} from "recoil";
import {appRoutesDataOptionsState} from "@/pages/app-routes/components/app-routes/store.ts";
import {useLayoutOutletContext} from "@/pages/app-routes/components/app-routes/layout.tsx";
import {useEffect} from "react";
import {ChevronLeft, ChevronRight} from "lucide-react";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import Filter from "@/pages/app-routes/components/app-routes/filter";
import {RouteFilterEnum} from "@/constant/api/app-routes/types.ts";
import {Button} from "@/components/ui/button.tsx";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.tsx";
import filterConfig from "@/pages/app-routes/components/app-routes/filter/config.tsx";

const filtersFrom = z.object({filters: filtersSchema})
export type FiltersFormSchemaValues = z.infer<typeof filtersFrom>

export interface PluginsConfPageProps {

  preview?: boolean
}

/**
 * 插件配置
 * @constructor
 */
export default function PluginsConfPage(props: PluginsConfPageProps) {
  const {preview = false} = props;

  const [appRoutesDataOptions, setAppRoutesDataOptions] = useRecoilState(appRoutesDataOptionsState);
  const outletContext = useLayoutOutletContext();

  const form = useForm<FiltersFormSchemaValues>({
    resolver: zodResolver(filtersFrom),
    defaultValues: {filters: appRoutesDataOptions.filters || []},
    disabled: preview
  });

  const fieldArray = useFieldArray({
    control: form.control,
    name: "filters",
  });

  const {
    fields: filtersFields,
    remove: filtersRemove,
    update: filtersUpdate,
  } = fieldArray

  useEffect(() => {
    if (preview) {
      form.trigger().then()
    }
  }, [preview])

  /**
   * 提交数据
   * @param data
   */
  function onSubmit(data: FiltersFormSchemaValues) {
    setAppRoutesDataOptions({...appRoutesDataOptions, ...data})
    outletContext.nextPage()
  }

  return (
    <div className={"max-w-4xl"}>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>

          <Card>
            <CardHeader>
              <CardTitle className={"flex flex-row items-center text-xl"}>
                已开启插件
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-row gap-4">

                <div className="flex">
                  <div className={"flex-auto flex justify-center items-center"}>
                    <ChevronLeft/>
                  </div>
                </div>

                <div className={"flex-auto flex flex-row gap-4"}>
                  {
                    filtersFields.map((field, index) => {
                      return (
                        <Filter key={index}
                                type={field.type}
                                value={field}
                                onChange={(value) => filtersUpdate(index, value)}
                                onRemove={() => filtersRemove(index)}
                                enable={preview ? "preview" : true}
                                showDescription={false}
                        />
                      )
                    })
                  }
                </div>

                <div className="flex">
                  <div className={"flex-auto flex justify-center items-center"}>
                    <ChevronRight/>
                  </div>
                </div>
              </div>

            </CardContent>
          </Card>

          {
            !preview && (
              <Card className={"mt-4"}>
                <CardHeader>
                  <CardTitle className={"flex flex-row items-center text-xl"}>
                    插件中心
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <PluginCenter fieldArray={fieldArray}/>
                </CardContent>
              </Card>
            )
          }

          {
            !preview && (
              <Button type="submit" className={"mt-6"}>
                保存
              </Button>
            )
          }
        </form>
      </Form>
    </div>
  )
}

interface PluginCenterProps {
  fieldArray: UseFieldArrayReturn<FiltersFormSchemaValues, 'filters'>
}

/**
 * 插件中心
 * @constructor
 */
function PluginCenter({fieldArray}: PluginCenterProps) {

  return (
    <Tabs defaultValue="authentication">
      <TabsList>
        {
          filterConfig.map((it) => (
            <TabsTrigger key={it.key} value={it.key}>{it.label}</TabsTrigger>
          ))
        }
      </TabsList>
      {
        filterConfig.map((it) => (
          <TabsContent key={it.key} value={it.key}>
            <div className={"grid gap-4 md:grid-cols-2 lg:grid-cols-4"}>
              {
                it.filters.map((type) => (
                  <PluginFilter key={type} type={type} fieldArray={fieldArray}/>
                ))
              }
            </div>
          </TabsContent>
        ))
      }
    </Tabs>
  )
}

/**
 * 插件过滤器配置
 * @param type
 * @param fieldArray
 * @constructor
 */
function PluginFilter({type, fieldArray}: { type: RouteFilterEnum } & PluginCenterProps) {

  const {
    fields: filtersFields,
    append: filtersAppend,
    remove: filtersRemove,
    update: filtersUpdate
  } = fieldArray

  const index = filtersFields.findIndex(item => item.type === type);
  const value = index >= 0 ? filtersFields[index] : undefined;

  /**
   * 在插件中心更新
   * @param value
   */
  function onPluginCenterChange(value: FilterFormValues) {
    const type = value.type;
    const index = filtersFields.findIndex(item => item.type === type);

    if (index >= 0) {
      filtersUpdate(index, value)
    } else {
      filtersAppend(value)
    }
  }

  return (
    <Filter type={type}
            value={value}
            enable={index >= 0}
            showDescription={true}
            onChange={onPluginCenterChange}
            onRemove={() => filtersRemove(index)}
    />
  )

}
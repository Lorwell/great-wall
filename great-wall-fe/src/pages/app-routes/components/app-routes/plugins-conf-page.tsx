import {useFieldArray, useForm} from "react-hook-form";
import {filtersSchema} from "@/constant/api/app-routes/schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Form} from "@/components/ui/form.tsx";
import {useRecoilState} from "recoil";
import {appRoutesDataOptionsState} from "@/pages/app-routes/components/app-routes/store.ts";
import {useLayoutOutletContext} from "@/pages/app-routes/components/app-routes/layout.tsx";
import {useEffect} from "react";
import {ChevronLeft, ChevronRight, Fingerprint} from "lucide-react";
import FilterCard from "@/pages/app-routes/components/app-routes/FilterCard.tsx";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs.tsx";
import BasicAuth from "@/pages/app-routes/components/app-routes/filter/basic-auth.tsx";

const filtersFrom = z.object({filters: filtersSchema})
export type FiltersFormValues = z.infer<typeof filtersFrom>

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

  const form = useForm<FiltersFormValues>({
    resolver: zodResolver(filtersFrom),
    defaultValues: {filters: appRoutesDataOptions.filters || []}
  });

  const {
    fields: filtersFields,
    append: filtersAppend,
    swap: filtersSwap,
    remove: filtersRemove,
  } = useFieldArray({
    control: form.control,
    name: "filters",
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
  function onSubmit(data: FiltersFormValues) {
    setAppRoutesDataOptions({...appRoutesDataOptions, ...data})
    outletContext.nextPage()
  }

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>

          <div className={"text-lg"}>
            已开启插件
          </div>

          <div className="flex flex-row gap-4 mt-4">

            <div className="flex">
              <div className={"flex-auto flex justify-center items-center"}>
                <ChevronLeft/>
              </div>
            </div>

            <div className={"flex-auto flex flex-row gap-4"}>

              <FilterCard icon={<Fingerprint className={"w-6 h-6"}/>}
                          title={"Basic Auth"}
                          showChildren={false}
              >
                <a className={"text-blue-600"} href={"https://datatracker.ietf.org/doc/html/rfc7235"}>RFC 7235</a>
                &nbsp;HTTP 身份验证
              </FilterCard>

            </div>

            <div className="flex">
              <div className={"flex-auto flex justify-center items-center"}>
                <ChevronRight/>
              </div>
            </div>
          </div>

        </form>
      </Form>

      <PluginCenter/>
    </div>
  )
}

/**
 * 插件中心
 * @constructor
 */
function PluginCenter() {
  return (
    <div>
      <div className={"text-lg mt-4"}>
        插件中心
      </div>

      <Tabs defaultValue="authentication" className={"mt-4"}>
        <TabsList className={"mb-2"}>
          <TabsTrigger value="authentication">身份验证</TabsTrigger>
          <TabsTrigger value="security-protection">安全防护</TabsTrigger>
          <TabsTrigger value="flow-control">流量控制</TabsTrigger>
        </TabsList>
        <TabsContent value="authentication">
          <BasicAuth/>
        </TabsContent>
        <TabsContent value="security-protection">
        </TabsContent>
        <TabsContent value="flow-control">
        </TabsContent>
      </Tabs>
    </div>
  )
}
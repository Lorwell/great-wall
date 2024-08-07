import {ReactElement, ReactNode, useEffect} from "react";
import {Outlet, useLocation, useNavigate, useOutletContext} from "react-router-dom";
import {isNull} from "@/utils/Utils.ts";
import {toast} from "sonner";
import {cn} from "@/utils/shadcnUtils.ts";
import AutoSizablePanel from "@/components/custom-ui/auto-sizable-panel.tsx";
import {Spinner} from "@/components/custom-ui/spinner.tsx";
import {useRecoilValue} from "recoil";
import {appRoutesDataOptionsState} from "@/pages/app-routes/components/app-routes/store.ts";
import {AppRoutesDataOptions} from "@/pages/app-routes/components/app-routes/schema.ts";

interface LayoutProps {
  title: string | ReactNode | ReactElement
  loading?: boolean
  items?: SidebarNavItem[]
}

export interface SidebarNavItem {
  to: string
  title: string

  /**
   * 结构 [AppRoutesDataOptions] 的键
   */
  dataKey: Array<keyof AppRoutesDataOptions>
}

export interface LayoutOutletContext {

  /**
   * 下一页
   */
  nextPage: () => void

}

export function useLayoutOutletContext() {
  return useOutletContext<LayoutOutletContext>()
}

const sidebarNavItems: SidebarNavItem[] = [
  {
    title: "基础信息",
    to: "base-info",
    dataKey: ["baseInfo"]
  },
  {
    title: "路由条件",
    to: "predicates",
    dataKey: ["predicates"]
  },
  {
    title: "插件配置",
    to: "filter",
    dataKey: ["filters"]
  },
  {
    title: "配置预览",
    to: "preview",
    dataKey: ["baseInfo", "predicates", "filters"]
  }
]

/**
 * 应用路由布局
 * @param props
 * @constructor
 */
export default function Layout(props: LayoutProps) {
  const {
    title,
    loading = false,
    items = sidebarNavItems
  } = props

  const {pathname} = useLocation()
  const navigate = useNavigate();
  const appRoutesDataOptions = useRecoilValue(appRoutesDataOptionsState);

  useEffect(() => {
    const item = items.find(it => pathname.endsWith(it.to));

    if (isNull(item)) {
      navigate("base-info")
    }
  }, [])

  /**
   * 下一页
   */
  function nextPage() {
    let itemIndex = items.findIndex(it => pathname.endsWith(it.to));
    itemIndex += 1

    const item = items.length > itemIndex ? items[itemIndex] : undefined

    if (isNull(item)) {
      toast.warning("没有下一页了",
        {
          position: "top-right"
        })
      return
    }

    navigate(item!!.to)
  }

  /**
   * 指定数据是否都存在， true 存在 反之不存在
   * @param dataKey
   */
  function hasDataByDataKey(dataKey: Array<keyof AppRoutesDataOptions>) {
    const hasDataLen = dataKey.filter(it => !isNull(appRoutesDataOptions[it])).length;
    return hasDataLen === dataKey.length
  }

  return (

    <div className={"w-full h-full p-10 pt-0 flex flex-col gap-8"}>

      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-semibold">
          {title}
        </h1>
      </div>

      <div
        className="flex-auto flex flex-row w-full items-start">
        <nav className={"flex flex-col gap-4 text-sm text-muted-foreground md:w-[180px] lg:w-[250px]"}>
          {items.map((item, index) => {
            const active = pathname.endsWith(item.to);

            const hasLastData = index > 0 ? (!!items[index - 1].dataKey ? !hasDataByDataKey(items[index - 1].dataKey!) : false) : false;
            const hasData = !!item.dataKey ? !hasDataByDataKey(item.dataKey) : false;
            const disabled = hasLastData && hasData
            return (
              <div key={item.to}
                   onClick={() => {
                     if (!disabled) {
                       navigate(item.to);
                     }
                   }}
                   className={cn(
                     "cursor-pointer",
                     active && "font-semibold text-primary",
                     disabled && "cursor-no-drop text-muted"
                   )}
              >
                {item.title}
              </div>
            )
          })}
        </nav>

        <AutoSizablePanel className={"flex-auto overflow-hidden"}>
          {
            (size) => (
              <div style={{...size}} className={"overflow-auto"}>
                {loading && (<Spinner/>)}
                {!loading && (<Outlet context={{nextPage}}/>)}
              </div>
            )
          }
        </AutoSizablePanel>
      </div>
    </div>
  )
}

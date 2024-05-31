import {ReactElement, ReactNode, useEffect} from "react";
import {Link, Outlet, useLocation, useNavigate, useOutletContext} from "react-router-dom";
import {isNull} from "@/utils/Utils.ts";
import {toast} from "sonner";
import {cn} from "@/utils/shadcnUtils.ts";
import AutoSizablePanel from "@/components/custom-ui/auto-sizable-panel.tsx";

interface LayoutProps {
  title: string | ReactNode | ReactElement
  loading?: boolean
  items?: SidebarNavItem[]
}

export interface SidebarNavItem {
  to: string
  title: string
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
  },
  {
    title: "路由条件",
    to: "predicates",
  },
  // {
  //   title: "插件配置",
  //   to: "filter",
  // },
  {
    title: "配置预览",
    to: "preview",
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

  return (

    <div className={"w-full h-full p-10 flex flex-col gap-8"}>

      <div className="w-full max-w-6xl">
        <h1 className="text-2xl font-semibold">
          {title}
        </h1>
      </div>

      <div
        className="flex-auto flex flex-row w-full max-w-6xl items-start gap-6">
        <nav className={"flex flex-col gap-4 text-sm text-muted-foreground md:w-[180px] lg:w-[250px]"}>
          {items.map((item) => {
            const active = pathname.endsWith(item.to);
            return (
              <Link key={item.to}
                    to={item.to}
                    className={cn(
                      active && "font-semibold text-primary",
                    )}
              >
                {item.title}
              </Link>
            )
          })}
        </nav>

        <AutoSizablePanel className={"flex-auto overflow-hidden"}>
          {
            (size) => (
              <div style={{...size}} className={"overflow-auto"}>
                <Outlet context={{nextPage}}/>
              </div>
            )
          }
        </AutoSizablePanel>
      </div>
    </div>
  )
}

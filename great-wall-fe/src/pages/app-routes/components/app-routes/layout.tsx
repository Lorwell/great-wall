import {Separator} from "@/components/ui/separator.tsx"
import {SidebarNav, SidebarNavItem} from "./sidebar-nav.tsx"
import {ReactElement, ReactNode} from "react";
import {Outlet, useLocation, useNavigate, useOutletContext} from "react-router-dom";
import {replacePathname} from "@/components/hooks/useRoutePathVariate.ts";
import {isNull} from "@/utils/Utils.ts";
import {toast} from "sonner";


interface LayoutProps {
  title: string | ReactNode | ReactElement
  subTitle?: string | ReactNode | ReactElement
  items: SidebarNavItem[]
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

/**
 * 应用路由布局
 * @param props
 * @constructor
 */
export default function Layout(props: LayoutProps) {
  const {
    title,
    subTitle,
    items
  } = props

  const {pathname} = useLocation()
  const navigate = useNavigate();

  /**
   * 下一页
   */
  function nextPage() {
    let itemIndex = items.findIndex(it => replacePathname(it.to, pathname) === pathname);
    itemIndex += 1

    const item = items.length > itemIndex ? items[itemIndex] : undefined

    if (isNull(item)) {
      toast.warning("没有下一页了",
        {
          position: "top-right"
        })
      return
    }

    navigate(replacePathname(item!!.to, pathname))
  }

  return (
    <div className="hidden space-y-6 px-6 pt-2 pb-16 md:block">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">
          {title}
        </h2>
        <p className="text-muted-foreground">
          {subTitle}
        </p>
      </div>
      <Separator className="my-6"/>
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <aside className="-mx-4 lg:w-1/6">
          <SidebarNav items={items}/>
        </aside>
        <div className="flex-1 lg:max-w-2xl">
          <Outlet context={{nextPage}}/>
        </div>
      </div>
    </div>
  )
}

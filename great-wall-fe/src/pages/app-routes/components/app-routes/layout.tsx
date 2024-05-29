import {ReactElement, ReactNode} from "react";
import {Link, Outlet, useLocation, useNavigate, useOutletContext} from "react-router-dom";
import {replacePathname} from "@/components/hooks/useRoutePathVariate.ts";
import {isNull} from "@/utils/Utils.ts";
import {toast} from "sonner";
import {cn} from "@/utils/shadcnUtils.ts";

interface LayoutProps {
  title: string | ReactNode | ReactElement
  items: SidebarNavItem[]
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

/**
 * 应用路由布局
 * @param props
 * @constructor
 */
export default function Layout(props: LayoutProps) {
  const {
    title,
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
    <div className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-10">
      <div className="grid w-full max-w-6xl gap-2">
        <h1 className="text-2xl font-semibold">
          {title}
        </h1>
      </div>

      <div className="grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav className={"grid gap-4 text-sm text-muted-foreground"}>
          {items.map((item) => {
            const active = pathname === item.to;
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
        <div className="grid gap-6">
          <Outlet context={{nextPage}}/>
        </div>
      </div>

    </div>
  )
}

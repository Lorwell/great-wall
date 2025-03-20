import {cn} from "@/lib/shadcnUtils"
import {Tooltip, TooltipContent, TooltipTrigger,} from "@/components/ui/tooltip"
import {Link, useLocation} from "react-router-dom";
import {buttonVariants} from "@/components/ui/button.tsx";
import {isNull} from "@/lib/utils.ts";
import {IconType} from "@/components/types.tsx";

export interface Path {
  pathname: string;
  search: string;
  hash: string;
}

export interface NavLink {
  title: string
  badge?: string
  icon: IconType
  to?: string | Partial<Path>
}

export interface NavProps {
  isCollapsed: boolean
  links: NavLink[]
}

/**
 * 导航组件
 * @param links
 * @param isCollapsed
 * @constructor
 */
export function Nav({links, isCollapsed}: NavProps) {
  const {pathname} = useLocation();

  /**
   * 是否激活当前导航
   * @param to
   */
  function isActive(to?: string | Partial<Path>): boolean {
    if (isNull(to)) {
      return false
    } else if (typeof to === "string") {
      return pathname.startsWith(to)
    } else {
      return !isNull(to?.pathname) && pathname.startsWith(to!!.pathname as string)
    }
  }

  return (
    <div
      data-collapsed={isCollapsed}
      className="group flex flex-col gap-4 py-2 data-[collapsed=true]:py-2"
    >
      <nav
        className="grid gap-1 px-2 group-[[data-collapsed=true]]:justify-center group-[[data-collapsed=true]]:px-2">
        {
          links.map((link, index) => {
              let active = isActive(link.to);
              return isCollapsed
                ? (
                  <Tooltip key={index} delayDuration={0}>
                    <TooltipTrigger asChild>
                      <Link to={link.to || "#"}
                            className={cn(
                              buttonVariants({variant: active ? "default" : "ghost", size: "icon"}),
                              "h-9 w-9",
                              active &&
                              "dark:bg-muted dark:text-muted-foreground dark:hover:bg-muted dark:hover:text-white"
                            )}
                      >
                        <link.icon className="h-4 w-4"/>
                        <span className="sr-only">{link.title}</span>
                      </Link>
                    </TooltipTrigger>
                    <TooltipContent side="right" className="flex items-center gap-4">
                      {link.title}
                      {link.badge && (
                        <span className="ml-auto text-muted-foreground">{link.badge}</span>
                      )}
                    </TooltipContent>
                  </Tooltip>
                )
                : (
                  <Link key={index}
                        to={link.to || "#"}
                        className={cn(
                          buttonVariants({variant: active ? "default" : "ghost", size: "sm"}),
                          "justify-start",
                          active && "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                        )}
                  >
                    <link.icon className="mr-2 h-4 w-4"/>
                    {link.title}
                    {link.badge && (
                      <span className={
                        cn(
                          "ml-auto",
                          active && "text-background dark:text-white"
                        )}
                      >
                                        {link.badge}
                     </span>
                    )}
                  </Link>
                )
            }
          )
        }
      </nav>
    </div>
  )
}

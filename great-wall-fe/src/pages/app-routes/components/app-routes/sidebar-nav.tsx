import {buttonVariants} from "@/components/ui/button.tsx"
import {cn} from "@/utils/shadcnUtils.ts"
import {Link, useLocation} from "react-router-dom";
import {HTMLAttributes} from "react";

export interface SidebarNavItem {
  to: string
  title: string
}

interface SidebarNavProps extends HTMLAttributes<HTMLElement> {
  items: SidebarNavItem[]
}

/**
 * 侧边导航
 * @param className
 * @param items
 * @param props
 * @constructor
 */
export function SidebarNav({className, items, ...props}: SidebarNavProps) {
  const {pathname} = useLocation()

  return (
    <nav
      className={cn(
        "flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1",
        className
      )}
      {...props}
    >
      {items.map((item) => {
        const active = pathname === item.to;
        return (
          <Link key={item.to}
                to={item.to}
                className={cn(
                  buttonVariants({variant: active ? "default" : "ghost"}),
                  "justify-start",
                  active && "dark:bg-muted dark:text-white dark:hover:bg-muted dark:hover:text-white",
                )}
          >
            {item.title}
          </Link>
        )
      })}
    </nav>
  )
}

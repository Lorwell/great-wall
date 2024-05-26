import {Separator} from "@/components/ui/separator"
import {SidebarNav, SidebarNavItem} from "./sidebar-nav"
import {ReactElement, ReactNode} from "react";
import {Outlet} from "react-router-dom";



interface LayoutProps {
    title: string | ReactNode | ReactElement
    subTitle?: string | ReactNode | ReactElement
    items: SidebarNavItem[]
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
                    <Outlet/>
                </div>
            </div>
        </div>
    )
}

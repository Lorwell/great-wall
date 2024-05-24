import {NavLink} from "@/components/nav.tsx";
import {CloudCog, LayoutPanelLeft} from "lucide-react";

export const navConfig: NavLink[] = [
    {
        title: "监控指标",
        icon: CloudCog,
        to: "/manage/as"
    },
    {
        title: "应用路由",
        badge: "128",
        icon: LayoutPanelLeft,
        to: "/manage/ab"
    },
]
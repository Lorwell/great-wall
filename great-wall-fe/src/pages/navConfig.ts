import {NavLink} from "@/components/nav.tsx";
import {CloudCog, LayoutPanelLeft, ScrollText} from "lucide-react";

export const navConfig: NavLink[] = [
  {
    title: "监控指标",
    icon: CloudCog,
    to: "/manage/monitor-metrics"
  },
  {
    title: "应用路由",
    icon: LayoutPanelLeft,
    to: "/manage/app-routes"
  },
  {
    title: "日志管理",
    icon: ScrollText,
    to: "/manage/logs"
  },
]
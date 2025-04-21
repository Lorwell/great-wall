import {NavLink} from "@/components/nav.tsx";
import {CloudCog, Files, LayoutPanelLeft, ScrollText, Settings, ShieldCheck} from "lucide-react";

export const navConfig: NavLink[] = [
  {
    title: "监控指标",
    icon: CloudCog,
    to: "/manage/monitor-metrics/route"
  },
  {
    title: "应用路由",
    icon: LayoutPanelLeft,
    to: "/manage/app-routes/list"
  },
  {
    title: "静态资源",
    icon: Files,
    to: "/manage/static-resources"
  },
  {
    title: "日志管理",
    icon: ScrollText,
    to: "/manage/logs/list"
  },
  {
    title: "证书管理",
    icon: ShieldCheck,
    to: "/manage/tls"
  },
  {
    title: "系统设置",
    icon: Settings,
    to: "/manage/settings"
  },
]
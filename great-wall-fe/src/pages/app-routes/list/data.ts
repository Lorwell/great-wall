import {AppRoute} from "@/pages/app-routes/list/schema.ts";
import {AppRouteStatusEnum} from "@/constant/api/app-routes/types.ts";

export const data: AppRoute[] = [
    {
        id: 1,
        name: "测试",
        describe: "xxx",
        uris: ["https://mirage.shacocloud.cc", "https://mirage.shacocloud.cc", "https://mirage.shacocloud.cc"],
        status: AppRouteStatusEnum.ONLINE,
        priority: 10,
        createTime: new Date(),
        lastUpdateTime: new Date()
    }
]
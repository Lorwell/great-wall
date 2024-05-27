import {z} from "zod";
import {AppRouteStatusEnum} from "@/constant/api/app-routes/types.ts";

export const schema = z.object({
  id: z.number(),
  name: z.string(),
  describe: z.string().optional(),
  uris: z.array(z.string()),
  priority: z.number(),
  status: z.enum([AppRouteStatusEnum.DRAFT, AppRouteStatusEnum.ONLINE, AppRouteStatusEnum.OFFLINE]),
  createTime: z.date(),
  lastUpdateTime: z.date()
})

export type AppRoute = z.infer<typeof schema>
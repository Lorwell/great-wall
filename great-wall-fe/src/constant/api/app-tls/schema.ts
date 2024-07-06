import {z} from "zod";
import {baseOutputSchema} from "@/constant/api/schema.ts";
import {TlsTypeEnum} from "@/constant/api/app-tls/types.ts";


export const osfipinConfigSchema =z.object({

})

export const tlsOutputSchema = z.object({
  expiredTime: z.number(),
  type: z.enum([TlsTypeEnum.Custom, TlsTypeEnum.Osfipin]),
}).merge(baseOutputSchema)


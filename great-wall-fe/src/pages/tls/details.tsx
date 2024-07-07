import {TlsOutput, TlsTypeEnum} from "@/constant/api/app-tls/types.ts";
import TlsButton from "@/pages/tls/tls-button.tsx";
import CustomDetails from "@/pages/tls/custom/details.tsx";
import LabelText from "@/pages/tls/label-text.tsx";
import dayjs from "dayjs";
import OsfipinDetails from "@/pages/tls/osfipin/details.tsx";

export interface DetailsProps {

  data: TlsOutput

}

/**
 * 证书详情
 * @constructor
 */
export default function Details({data}: DetailsProps) {

  return (
    <div className="w-[95%] border rounded p-8 pb-4 ml-[2%]">

      <div className="flex flex-col gap-8">

        <div className={"flex flex-row justify-between"}>
          <div className={"text-xl font-bold"}>证书详情</div>
          <TlsButton type={"update"}/>
        </div>

        <div>
          {data.config?.type === TlsTypeEnum.Custom && (
            <CustomDetails config={data.config}/>
          )}
          {data.config?.type === TlsTypeEnum.Osfipin && (
            <OsfipinDetails config={data.config}/>
          )}
          <LabelText label={"过期时间"}
                     value={!!data.expiredTime ? dayjs(data.expiredTime).format("YYYY-MM-DD HH:mm:ss") : "-"}
          />
          <LabelText label={"创建时间"}
                     value={dayjs(data.createTime).format("YYYY-MM-DD HH:mm:ss")}
          />
          <LabelText label={"最后修改时间"}
                     value={dayjs(data.lastUpdateTime).format("YYYY-MM-DD HH:mm:ss")}
                     separator={false}
          />
        </div>
      </div>

    </div>
  )
}


import {TlsOutput, TlsTypeEnum} from "@/constant/api/app-tls/types.ts";
import TlsButton from "@/pages/tls/tls-button.tsx";
import CustomDetails from "@/pages/tls/custom/details.tsx";
import LabelText from "@/pages/tls/label-text.tsx";
import dayjs from "dayjs";
import OsfipinDetails from "@/pages/tls/osfipin/details.tsx";
import FormHoverDescription from "@/components/custom-ui/form-hover-description.tsx";
import {Button} from "@/components/ui/button";
import {Download, Eraser} from "lucide-react";
import {downloadFile} from "@/lib/utils.ts";
import useApiRequest from "@/components/hooks/use-api-request.ts";
import {tlsDelete} from "@/constant/api/app-tls";

export interface DetailsProps {

  data: TlsOutput

  onRefresh?: () => void

}

/**
 * 证书详情
 * @constructor
 */
export default function Details({data, onRefresh}: DetailsProps) {

  const {loading: tlsDeleteLoading, runAsync: tlsDeleteRun} = useApiRequest(tlsDelete, {manual: true});

  /**
   * 处理下载
   */
  function handleDownload() {
    downloadFile("tls.zip", "/api/tls/download")
  }

  /**
   * 处理删除
   */
  async function handleDelete() {
    await tlsDeleteRun()
    onRefresh?.();
  }

  return (
    <div className="w-[95%] border rounded p-8 pb-4 ml-[2%]">
      <div className="flex flex-col gap-8">
        <div className={"flex flex-row justify-between items-center"}>
          <div className={"text-xl font-bold"}>证书详情</div>
          <div className={"flex flex-row items-center gap-2"}>
            <TlsButton type={"update"} config={data.config!!}/>
            <Button variant={"secondary"} className="w-32"
                    onClick={handleDownload}
            >
              <Download className={"w-6 h-6"}/>
              <span className={"ml-2"}>下载证书</span>
            </Button>
            <Button variant={"secondary"}
                    className="w-32"
                    loading={tlsDeleteLoading}
                    onClick={handleDelete}
            >
              <Eraser className={"w-6 h-6"}/>
              <span className={"ml-2"}>删除证书</span>
            </Button>
          </div>
        </div>

        <div>
          {data.config?.type === TlsTypeEnum.Custom && (
            <CustomDetails config={data.config}/>
          )}
          {data.config?.type === TlsTypeEnum.Osfipin && (
            <OsfipinDetails config={data.config}/>
          )}
          <LabelText label={(<ExpiredTimeLabel/>)}
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


function ExpiredTimeLabel() {
  return (
    <div className={"flex flex-row items-center gap-2"}>
      <span>过期时间</span>
      <FormHoverDescription>
        过期时间如果为空，将导致无法自动更新证书
      </FormHoverDescription>
    </div>
  )
}

import LabelText from "@/pages/tls/label-text.tsx";
import {OsfipinConfigSchemaValues} from "@/constant/api/app-tls/schema.ts";

/**
 * 来此加密配置
 * @constructor
 */
export default function OsfipinDetails({config}: { config: OsfipinConfigSchemaValues }) {

  return (
    <div>
      <LabelText label={"证书类型"} value={"来此加密"}/>
      <LabelText label={"账户名"} value={config.user}/>
      <LabelText label={"自动申请id"} value={config.autoId}/>
      <LabelText label={"接口凭证"} value={config.token}/>
    </div>
  )
}
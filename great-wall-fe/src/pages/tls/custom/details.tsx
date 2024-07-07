import LabelText from "@/pages/tls/label-text.tsx";
import {CustomConfigSchemaValues} from "@/constant/api/app-tls/schema.ts";
import {Textarea} from "@/components/ui/textarea.tsx";

/**
 * 自定义配置
 * @constructor
 */
export default function CustomDetails({config}: { config: CustomConfigSchemaValues }) {

  return (
    <div>
      <LabelText label={"证书类型"} value={"自定义证书"}/>
      <LabelText label={"Cert 证书"} value={<Textarea rows={3}>{config.certificate}</Textarea>}/>
      <LabelText label={"Key 密钥"} value={config.privateKey}/>
    </div>
  )
}
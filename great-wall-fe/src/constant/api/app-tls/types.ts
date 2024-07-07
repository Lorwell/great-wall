import {TlsInputSchemaValues, TlsOutputSchemaValues} from "@/constant/api/app-tls/schema.ts";

export enum TlsTypeEnum {

  /**
   * 自定义证书
   */
  Custom = "Custom",

  /**
   * 来此加密
   *
   * https://letsencrypt.osfipin.com/
   */
  Osfipin = "Osfipin"

}

export type TlsInput = Partial<TlsInputSchemaValues>
export type TlsOutput = Partial<TlsOutputSchemaValues>
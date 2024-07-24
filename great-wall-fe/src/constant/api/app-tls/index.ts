import {TlsInput, TlsOutput} from "@/constant/api/app-tls/types.ts";
import {DeleteJson, Get, PutJson} from "@/constant/api";
import {tlsOutputSchema} from "@/constant/api/app-tls/schema.ts";

/**
 * 证书详情
 */
export function tlsDetails(): Promise<TlsOutput | undefined> {
  return Get(`/api/tls`);
}

/**
 * 证书更新
 */
export function tlsUpdate(input: TlsInput): Promise<TlsOutput> {
  return PutJson(`/api/tls`, {body: input, resultSchema: tlsOutputSchema});
}

/**
 * 证书删除
 */
export function tlsDelete(): Promise<void> {
  return DeleteJson(`/api/tls`);
}
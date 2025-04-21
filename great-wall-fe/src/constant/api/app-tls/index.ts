import {TlsInput, TlsOutput} from "@/constant/api/app-tls/types.ts";
import {deleteJsonRequest, getRequest, putJsonRequest} from "@/constant/api";
import {tlsOutputSchema} from "@/constant/api/app-tls/schema.ts";

/**
 * 证书详情
 */
export function tlsDetails(): Promise<TlsOutput | undefined> {
  return getRequest(`/api/tls`);
}

/**
 * 证书更新
 */
export function tlsUpdate(input: TlsInput): Promise<TlsOutput> {
  return putJsonRequest(`/api/tls`, {body: input, resultSchema: tlsOutputSchema});
}

/**
 * 证书删除
 */
export function tlsDelete(): Promise<void> {
  return deleteJsonRequest(`/api/tls`);
}
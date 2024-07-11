import {LoginInput} from "@/constant/api/login/types.ts";
import {PostJson} from "@/constant/api";

/**
 * 登录
 * @param input
 */
export function login(input: LoginInput): Promise<void> {
  return PostJson(`/api/login`, {body: input})
}
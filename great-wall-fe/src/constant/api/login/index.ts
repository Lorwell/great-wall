import {LoginInput} from "@/constant/api/login/types.ts";
import {postJsonRequest} from "@/constant/api";

/**
 * 登录
 * @param input
 */
export function login(input: LoginInput): Promise<void> {
  return postJsonRequest(`/api/login`, {body: input})
}
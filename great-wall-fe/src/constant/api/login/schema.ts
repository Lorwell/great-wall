import {z} from "zod";

export const loginFormSchema = z.object({
  username: z.string({required_error: "不可以为空"})
    .min(2, {
      message: "不能少于2个字符",
    })
    .max(20, {
      message: "不能超过20个字符",
    }),
  password: z.string({required_error: "不可以为空"})
    .max(50, {
      message: "不能超过50个字符",
    })
})

export type  LoginFormValues = z.infer<typeof loginFormSchema>
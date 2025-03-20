import {HttpException} from "@/constant/api";
import {getErrorMessage} from "@/components/hooks/use-api-request.ts";
import {isBlank, isNull} from "@/lib/utils.ts";
import {FieldValues, UseFormReturn} from "react-hook-form";
import {toast} from "sonner";
import {FieldsErrorValues} from "@/constant/api/schema.ts";

export type Service<T> = () => Promise<T>

export type FieldErrorSpecificationCallback = <T>(service: Service<T>) => Promise<T>

/**
 * 表单提交字段错误规范 Hooks
 */
function useFromFieldErrorSpecification<TFieldValues extends FieldValues = FieldValues>(
  form: UseFormReturn<TFieldValues>,
  noticeError?: boolean
): FieldErrorSpecificationCallback {
  const notice = isNull(noticeError) ? true : noticeError

  const {setError} = form

  return async (service) => {
    try {
      return await service();
    } catch (e) {
      // http 异常状态码处理
      if (e instanceof HttpException) {
        if (e.status === 422) {
          const fields = (e.body as Partial<FieldsErrorValues>).fields;
          for (let key in fields) {
            const value = fields[key];
            if (value.length > 0) {
              const fieldError = value[0];
              // @ts-ignore
              setError(key, {type: fieldError.code, message: fieldError.message})
            }
          }
        }
        // 其他状态码
        else if (notice) {
          let detail = getErrorMessage(e)
          toast.warning(detail, {
            position: "top-right",
          })
        }
      }
      // 其他异常！
      else if (notice) {
        let detail: string

        if (e instanceof Error) {
          const message = e.message
          detail = `未知的异常${isBlank(message) ? "!" : `: ${message}`}`
        } else {
          detail = `未知的异常!`
        }

        toast.warning(detail, {
          position: "top-right",
        })
      }

      throw e;
    }
  }
}

export default useFromFieldErrorSpecification;
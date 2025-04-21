import {FieldValues, UseFormReturn} from "react-hook-form";
import useApiRequest, {ApiRequestOptions} from "@/components/hooks/use-api-request.ts";
import {Result, Service} from "ahooks/lib/useRequest/src/types";
import useFormFieldErrorSpecification from "@/components/hooks/use-form-field-error-specification.ts";
import {useCallback} from "react";

export type UseFromApiRequestOptions<TData, TParams extends any[], TFieldValues extends FieldValues = FieldValues> =
  ApiRequestOptions<TData, TParams>
  & {
  form: UseFormReturn<TFieldValues>,
}

/**
 * 表单请求
 * @param service
 * @param form
 * @param noticeError
 * @param options
 */
export const useFormApiRequest = <TData, TParams extends any[], TFieldValues extends FieldValues = FieldValues>(
  service: Service<TData, TParams>,
  {
    form,
    noticeError = true,
    ...options
  }: UseFromApiRequestOptions<TData, TParams, TFieldValues>
): Result<TData, TParams> => {
  const {runAsync, run, ...rest} = useApiRequest(service, {...options, noticeError: false, manual: true});
  const specification = useFormFieldErrorSpecification(form, noticeError);

  const runAsyncSpecification = useCallback(async (...data: TParams) => {
    return await specification(() => runAsync(...data));
  }, [service, specification]);

  const runSpecification = useCallback((...data: TParams) => {
    specification(() => runAsync(...data)).then();
  }, [service, specification]);

  return {
    ...rest,
    run: runSpecification,
    runAsync: runAsyncSpecification
  }
}
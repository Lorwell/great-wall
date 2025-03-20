import {NumberFilterOptions} from "@/components/custom-ui/data-table/types.ts";
import {Column} from "@tanstack/react-table";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {calculateMaxNumber, calculateMinNumber, calculateMinStep} from "@/lib/utils.ts";
import {useCreation} from "ahooks";

export const numberFormSchema = z.object({
  max: z.coerce.number().optional().nullish(),
  min: z.coerce.number().optional().nullish(),
})
export type NumberFormData = z.infer<typeof numberFormSchema>

/**
 * 数值过滤器
 * @constructor
 */
export function NumberFormFilter(
  {
    column,
    onSubmit,
    filter
  }: { filter: NumberFilterOptions, column: Column<any>, onSubmit?: () => void }
) {

  const form = useForm<NumberFormData>({
    resolver: zodResolver(numberFormSchema),
    defaultValues: column.getFilterValue() as NumberFormData | undefined
  });

  function handleSubmit(data: NumberFormData | undefined) {
    if (data?.min || data?.max) {
      column.setFilterValue({min: data?.min, max: data?.max});
    } else {
      column.setFilterValue(undefined);
    }

    onSubmit?.();
  }

  const [maxNumber, minNumber, step] = useCreation(() => {
    const {precision, scale} = filter
    const maxNumber = calculateMaxNumber(precision + scale, scale);
    const minNumber = calculateMinNumber(precision + scale, scale);
    const step = calculateMinStep(precision + scale, scale);
    return [maxNumber, minNumber, step];
  }, [filter])

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 justify-end w-[400px] py-2 px-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField control={form.control}
                   name="min"
                   render={({field}) => (
                     <FormItem>
                       <FormLabel>最小值</FormLabel>
                       <FormControl>
                         <Input
                           {...field}
                           value={field.value || ""}
                           type={"number"}
                           max={maxNumber}
                           min={minNumber}
                           step={step}
                         />
                       </FormControl>
                       <FormMessage/>
                     </FormItem>
                   )}
        />
        <FormField control={form.control}
                   name="max"
                   render={({field}) => (
                     <FormItem>
                       <FormLabel>最大值</FormLabel>
                       <FormControl>
                         <Input
                           {...field}
                           value={field.value || ""}
                           type={"number"}
                           max={maxNumber}
                           min={minNumber}
                           step={step}
                         />
                       </FormControl>
                       <FormMessage/>
                     </FormItem>
                   )}
        />
        <div className={"flex justify-end gap-2 mt-2"}>
          <Button
            type={"submit"}
            className={"px-8"}
          >
            提交
          </Button>
        </div>
      </form>
    </Form>
  )
}

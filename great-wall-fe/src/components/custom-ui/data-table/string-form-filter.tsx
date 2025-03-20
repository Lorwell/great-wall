import {StringFilterOptions} from "@/components/custom-ui/data-table/types.ts";
import {Column} from "@tanstack/react-table";
import {z} from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";

export const stringFormSchema = z.object({query: z.string()})
export type StringFormData = z.infer<typeof stringFormSchema>

/**
 * 字符过滤器
 * @constructor
 */
export function StringFormFilter(
  {
    column,
    onSubmit
  }: { filter: StringFilterOptions, column: Column<any>, onSubmit?: () => void }
) {

  const form = useForm<StringFormData>({
    resolver: zodResolver(stringFormSchema),
    defaultValues: column.getFilterValue() as StringFormData | undefined
  });

  function handleSubmit(data: StringFormData | undefined) {
    column.setFilterValue(data);
    onSubmit?.();
  }

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-4 justify-end w-[400px] py-2 px-4"
        onSubmit={form.handleSubmit(handleSubmit)}
      >
        <FormField control={form.control}
                   name="query"
                   render={({field}) => (
                     <FormItem>
                       <FormLabel>模糊搜索</FormLabel>
                       <FormControl>
                         <Input {...field} value={field.value || ""}/>
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

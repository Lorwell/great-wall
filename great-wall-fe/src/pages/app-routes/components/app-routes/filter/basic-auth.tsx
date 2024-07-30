import FilterCard from "@/pages/app-routes/components/app-routes/FilterCard.tsx";
import {Fingerprint} from "lucide-react";
import {Control, FieldPath, FieldValues, useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {useState} from "react";
import {Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle} from "@/components/ui/sheet.tsx";
import {basicAuthFilterSchema, BasicAuthFilterSchemaValues} from "@/constant/api/app-routes/schema.ts";
import {zodResolver} from "@hookform/resolvers/zod";
import {RouteFilterEnum} from "@/constant/api/app-routes/types.ts";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";

export interface RoutesProps {
  value?: BasicAuthFilterSchemaValues,
  onChange?: (value: BasicAuthFilterSchemaValues) => void
}

/**
 *  basic 认证
 * @constructor
 */
export default function BasicAuth(props: RoutesProps) {
  const {value, onChange} = props;
  const [open, setOpen] = useState(false);

  const form = useForm<BasicAuthFilterSchemaValues>({
    resolver: zodResolver(basicAuthFilterSchema),
    defaultValues: {...(value || {}), type: RouteFilterEnum.BasicAuth},
  });

  /**
   * 提交数据
   * @param data
   */
  function onSubmit(data: BasicAuthFilterSchemaValues) {
    onChange?.(data)
    setOpen(false);
  }

  return (
    <>
      <FilterCard icon={<Fingerprint className={"w-6 h-6"}/>}
                  title={"Basic Auth"}
                  onClick={() => setOpen(true)}
      >
        <Description/>
      </FilterCard>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent>
          <SheetHeader className="text-left">
            <SheetTitle>
              Basic Auth
            </SheetTitle>
            <SheetDescription>
              <Description/>
            </SheetDescription>
          </SheetHeader>

          <div className={"mt-6"}>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                <FormField control={form.control}
                           name="username"
                           render={({field}) => (
                             <FormItem>
                               <FormLabel>账号</FormLabel>
                               <FormControl>
                                 <Input {...field} />
                               </FormControl>
                               <FormMessage/>
                             </FormItem>
                           )}
                />

                <FormField control={form.control}
                           name="password"
                           render={({field}) => (
                             <FormItem>
                               <FormLabel>密码</FormLabel>
                               <FormControl>
                                 <Input {...field} />
                               </FormControl>
                               <FormMessage/>
                             </FormItem>
                           )}
                />
              </form>
            </Form>
          </div>

          <div className={"mt-6 flex flex-row justify-end"}>
            <Button variant={"secondary"}
                    onClick={async (event) => {
                      // event.preventDefault()
                      await form.trigger()
                      await form.handleSubmit(onSubmit)()
                    }}
            >
              保存
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  )
}

function Description() {
  return (
    <div>
      <a className={"text-blue-600"} href={"https://datatracker.ietf.org/doc/html/rfc7235"}>RFC 7235</a>
      &nbsp;HTTP 身份验证
    </div>
  )
}

/**
 *  basic 认证表单
 * @constructor
 */
export function BasicAuthField<
  TFieldValues extends FieldValues = FieldValues,
  TName extends FieldPath<TFieldValues> = FieldPath<TFieldValues>
>({control, name, className}: { control: Control<TFieldValues>, name: TName, className?: string }) {
  return (
    <FormField control={control}
               name={name}
               render={({field}) => (
                 <FormItem className={className}>
                   <FormControl>
                     <BasicAuth/>
                   </FormControl>
                   <FormMessage/>
                 </FormItem>
               )}
    />
  )
}
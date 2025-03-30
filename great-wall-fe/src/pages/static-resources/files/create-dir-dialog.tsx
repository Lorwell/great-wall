import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {forwardRef, useImperativeHandle, useState} from "react";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useFormApiRequest} from "@/components/hooks/use-form-api-request.ts";
import {staticResourcesCreateFileDir} from "@/constant/api/static-resources";
import {CreateFileDirInput, createFileDirInputSchema} from "@/constant/api/static-resources/schema.ts";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";

export type CreateDirDialogProps = {
  id: number
  parentDir?: string
  onConfirm?: () => void | Promise<void>
  onCancel?: () => void
}

export type CreateDirDialogInstance = {
  onShow: () => void
}

/**
 * 创建文件夹
 */
export const CreateDirDialog = forwardRef<CreateDirDialogInstance, CreateDirDialogProps>((
  {
    id,
    parentDir,
    onConfirm,
    onCancel
  }, ref): JSX.Element => {
  const [open, setOpen] = useState<boolean>(false)

  const form = useForm<CreateFileDirInput>({
    resolver: zodResolver(createFileDirInputSchema),
    defaultValues: {
      parentDir
    }
  });

  const {loading, runAsync} = useFormApiRequest(staticResourcesCreateFileDir, {form});

  /**
   * 提交数据
   */
  async function onSubmit(data: CreateFileDirInput) {
    await runAsync(id, data)
    await onConfirm?.()
    handleClose()
  }

  function handleClose() {
    setOpen(false)
    onCancel?.()
  }

  function handleOpenChange(open: boolean) {
    setOpen(open)
    if (!open) {
      handleClose()
    }
  }

  useImperativeHandle(ref, () => ({
    onShow: () => {
      setOpen(true)
    }
  }))

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={"flex flex-col gap-2 px-8 py-6"}>
        <DialogHeader>
          <DialogTitle className={"flex flex-row justify-between items-center"}>
            创建文件夹
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField control={form.control}
                       name="name"
                       render={({field}) => (
                         <FormItem>
                           <FormLabel>文件夹名称</FormLabel>
                           <FormControl>
                             <Input {...field} />
                           </FormControl>
                           <FormMessage/>
                         </FormItem>
                       )}
            />
            <Button type="submit" loading={loading} className="w-full">
              提交
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
});
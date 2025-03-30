import {Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle} from "@/components/ui/dialog.tsx";
import {Button} from "@/components/ui/button.tsx";
import {forwardRef, SyntheticEvent, useImperativeHandle, useState} from "react";
import {useUploadFile} from "@/components/custom-ui/file-uploader/use-upload-file.ts";
import {isEmpty} from "radash";
import {toast} from "sonner";
import {FileOutput} from "@/constant/api/static-resources/schema.ts";
import {FileUploader} from "@/components/custom-ui/file-uploader";

export type FileUploaderDialogProps = {
  id: number
  parentDir?: string
  onConfirm?: (files: Array<FileOutput>, e: SyntheticEvent<any>) => void | Promise<void>
  onCancel?: () => void
}

export type FileUploaderDialogInstance = {
  onShow: () => void
}

/**
 * 文件上传 Dialog
 * @constructor
 */
export const FileUploaderDialog = forwardRef<FileUploaderDialogInstance, FileUploaderDialogProps>((
  {
    id,
    parentDir,
    onConfirm,
    onCancel
  }, ref) => {
  const [open, setOpen] = useState<boolean>(false)
  const [files, setFiles] = useState<File[]>([])

  const {fileUploadStatusMap, isUploading, onToastUpload} = useUploadFile<FileOutput>({
    uri: `/api/static-resources/${id}/files`,
    body: {parentDir}
  })

  useImperativeHandle(ref, () => ({
    onShow: () => {
      setOpen(true)
    }
  }))

  function handleOpenChange(open: boolean) {
    setOpen(open)
    if (!open) {
      handleClose()
    }
  }

  /**
   * 处理文件上传
   */
  async function handleUpload(e: SyntheticEvent<any>) {
    if (isEmpty(files)) {
      toast.warning("文件为空")
      return
    }
    const fileOutputs = await onToastUpload(files);
    await onConfirm?.(fileOutputs, e)
    handleClose()
  }

  function handleClose() {
    setOpen(false)
    onCancel?.()
    setFiles([])
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className={"!w-3/5 max-w-[800px] flex flex-col gap-2 px-8 py-6"}>
        <DialogHeader>
          <DialogTitle className={"flex flex-row justify-between items-center"}>
            文件上传
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <div className={"flex flex-col gap-2 my-4"}>
          <FileUploader
            value={files}
            onValueChange={setFiles}
            fileUploadStatusMap={fileUploadStatusMap}
            disabled={isUploading}
            accept={{
              "*/*": [],
            }}
            multiple
            maxSize={1024 * 1024 * 1024}
          />
        </div>
        <Button onClick={handleUpload}>开始上传</Button>
      </DialogContent>
    </Dialog>
  )
})
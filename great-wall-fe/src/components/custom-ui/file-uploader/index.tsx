import React, {useCallback} from "react"
import {Cross2Icon, FileTextIcon, UploadIcon} from "@radix-ui/react-icons"
import Dropzone, {type DropzoneProps, type FileRejection, FileWithPath,} from "react-dropzone"
import {toast} from "sonner"
import {cn, formatBytes, removePrefix} from "@/lib/utils.ts"
import {useControllableState} from "@/components/hooks/use-controllable-state.ts"
import {Button} from "@/components/ui/button.tsx"
import {Progress} from "@/components/ui/progress.tsx"
import {ScrollArea} from "@/components/ui/scroll-area.tsx"
import {FileUploadStatus} from "@/components/custom-ui/file-uploader/use-upload-file.ts";

export interface FileUploaderProps<T> extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value of the uploader.
   * @type File[]
   * @default undefined
   * @example value={files}
   */
  value?: File[] | undefined | null

  /**
   * Function to be called when the value changes.
   * @type (files: File[]) => void
   * @default undefined
   * @example onValueChange={(files) => setFiles(files)}
   */
  onValueChange?: (files: File[]) => void

  /**
   * Function to be called when files are uploaded.
   * @type (files: File[]) => Promise<void>
   * @default undefined
   * @example onUpload={(files) => uploadFiles(files)}
   */
  onUpload?: (files: File[]) => Promise<void>

  /**
   * Progress of the uploaded files.
   * @type Map<string, FileProgress> | undefined
   * @default undefined
   * @example progresses={{ "file1.png": 50 }}
   */
  fileUploadStatusMap?: Map<string, FileUploadStatus<T>>

  /**
   * Accepted file types for the uploader.
   * @type { [key: string]: string[]}
   * @default
   * ```ts
   * { "image/*": [] }
   * ```
   * @example accept={["image/png", "image/jpeg"]}
   */
  accept?: DropzoneProps["accept"]

  /**
   * 上传工具接受的文件类型说明
   */
  acceptPlaceholder?: string

  /**
   * Maximum file size for the uploader.
   * @type number | undefined
   * @default 1024 * 1024 * 2 // 2MB
   * @example maxSize={1024 * 1024 * 2} // 2MB
   */
  maxSize?: DropzoneProps["maxSize"]

  /**
   * Maximum number of files for the uploader.
   * @type number | undefined
   * @default 1
   * @example maxFileCount={4}
   */
  maxFileCount?: DropzoneProps["maxFiles"]

  /**
   * Whether the uploader should accept multiple files.
   * @type boolean
   * @default false
   * @example multiple
   */
  multiple?: boolean

  /**
   * Whether the uploader is disabled.
   * @type boolean
   * @default false
   * @example disabled
   */
  disabled?: boolean
}

export function FileUploader<T>(props: FileUploaderProps<T>) {
  const {
    value: valueProp,
    onValueChange,
    onUpload,
    fileUploadStatusMap,
    accept,
    acceptPlaceholder,
    maxSize = 1024 * 1024 * 2,
    maxFileCount,
    multiple = false,
    disabled = false,
    className,
    ...dropzoneProps
  } = props

  const [files, setFiles] = useControllableState({
    defaultProp: [],
    prop: valueProp || [],
    onChange: onValueChange
  })

  // 处理错误信息
  const handlerError = useCallback((fileRejections: FileRejection[]) => {
    fileRejections.forEach(({file, errors}) => {
      errors.forEach((error) => {
        let message = error.message
        if (error.code === "file-too-large") {
          message = "文件大小超过限制！"
        }
        toast.warning(`${file.name} 导入失败：${message}`)
      })
    })
  }, []);

  const onDrop = React.useCallback(
    (acceptedFiles: File[], rejectedFiles: FileRejection[]) => {
      if (!multiple && maxFileCount === 1 && acceptedFiles.length > 1) {
        toast.error("一次不能上传多个文件!")
        return
      }

      if (maxFileCount) {
        if ((files?.length ?? 0) + acceptedFiles.length > maxFileCount) {
          toast.error(`上传的文件数量不能超过 ${maxFileCount} 个`)
          return
        }
      }


      const newFiles = acceptedFiles
        // 过滤已经存在的文件
        .filter(it => {
          const file = (files || [])
            .find(it1 =>
              it.name === it1.name && it.size === it1.size
              && it.type === it1.type && it.lastModified === it1.lastModified
            );
          const exits = !!file;
          if (exits) {
            toast.warning(`文件 ${it.name} 已经存在于列表中，已经被自动忽略`)
          }
          return !exits
        })
        .map((file) =>
          Object.assign(file, {
            preview: URL.createObjectURL(file),
          })
        )

      const updatedFiles = files ? [...files, ...newFiles] : newFiles
      setFiles(updatedFiles)

      if (rejectedFiles.length > 0) {
        handlerError(rejectedFiles)
      }

      if (onUpload && updatedFiles.length > 0 && (maxFileCount && updatedFiles.length <= maxFileCount)) {
        toast.promise(onUpload(updatedFiles), {
          loading: `文件上传中...`,
          success: () => {
            setFiles([])
            return `文件上传完成`
          },
          error: `文件上传失败`,
        })
      }
    },

    [files, maxFileCount, multiple, onUpload, setFiles, handlerError]
  )

  function onRemove(index: number) {
    if (!files) return
    const newFiles = files.filter((_, i) => i !== index)
    setFiles(newFiles)
  }

  // 卸载组件时撤销预览 URL
  React.useEffect(() => {
    return () => {
      if (!files) return
      files.forEach((file) => {
        if (isFileWithPreview(file)) {
          URL.revokeObjectURL(file.preview)
        }
      })
    }
  }, [])

  const isDisabled = disabled || (maxFileCount ? (files?.length ?? 0) >= maxFileCount : false)

  return (
    <div className="relative flex flex-col gap-6 overflow-hidden">
      <Dropzone
        onDrop={onDrop}
        accept={accept}
        maxSize={maxSize}
        maxFiles={maxFileCount}
        multiple={(maxFileCount && maxFileCount > 1) || multiple}
        disabled={isDisabled}
      >
        {({getRootProps, getInputProps, isDragActive}) => (
          <div
            {...getRootProps()}
            className={cn(
              "group relative grid h-52 w-full cursor-pointer place-items-center rounded-lg border-2 border-dashed border-muted-foreground/25 px-5 py-2.5 text-center transition hover:bg-muted/25",
              "ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
              isDragActive && "border-muted-foreground/50",
              isDisabled && "pointer-events-none opacity-60",
              className
            )}
            {...dropzoneProps}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <UploadIcon
                    className="size-7 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <p className="font-medium text-muted-foreground">
                  Drop the files here
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center gap-4 sm:px-5">
                <div className="rounded-full border border-dashed p-3">
                  <UploadIcon
                    className="size-7 text-muted-foreground"
                    aria-hidden="true"
                  />
                </div>
                <div className="flex flex-col gap-px">
                  <p className="font-medium text-muted-foreground">
                    将文件或文件夹拖放到此处，或单击以选择文件
                  </p>
                  <p className="text-sm text-muted-foreground/70">
                    {
                      maxFileCount && maxFileCount !== Infinity && (
                        `最多可以上传 ${maxFileCount} 个文件，`
                      )
                    }
                    单个文件最大 {formatBytes(maxSize)}
                    {!!acceptPlaceholder && "，"}
                    {acceptPlaceholder}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}
      </Dropzone>
      {files?.length ? (
        <ScrollArea className="h-fit w-full px-3">
          <div className="flex max-h-48 flex-col gap-4">
            {files?.map((file, index) => (
              <FileCard
                key={index}
                file={file}
                onRemove={() => onRemove(index)}
                fileUploadStatus={fileUploadStatusMap?.get(file.name)}
              />
            ))}
          </div>
        </ScrollArea>
      ) : null}
    </div>
  )
}

interface FileCardProps<T> {
  file: File | FileWithPath
  onRemove: () => void
  fileUploadStatus?: FileUploadStatus<T>
}

function FileCard<T>({file, fileUploadStatus, onRemove}: FileCardProps<T>) {
  return (
    <div className="relative flex items-center gap-2.5">
      <div className="flex flex-1 gap-2.5">
        {isFileWithPreview(file) ? <FilePreview file={file}/> : null}
        <div className="flex w-full flex-col gap-2 ">
          <div className={cn(
            "flex flex-col gap-px",
            {
              "text-destructive": fileUploadStatus?.status === "failed",
              "text-foreground/80": fileUploadStatus?.status !== "failed",
            }
          )}>
            <p className={"line-clamp-1 text-sm font-medium"}>
              {
                "relativePath" in file
                  ? removePrefix(file.relativePath as string, "/")
                  : removePrefix(file.webkitRelativePath as string, "/")
                  || file.name
              }
            </p>
            <p className="text-xs">
              {formatBytes(file.size)}
            </p>
          </div>
          <Progress
            value={fileUploadStatus?.progress}
            className={cn(
              "h-1",
              {
                "bg-destructive": fileUploadStatus?.status === "failed",
              }
            )}
          />
          {(fileUploadStatus?.status === "failed" && !!fileUploadStatus?.failMsg) && (
            <div className={"text-destructive text-xs"}>失败原因：{fileUploadStatus.failMsg}</div>
          )}
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant={"outline"}
          size="icon"
          className="size-7"
          onClick={onRemove}
          Icon={<Cross2Icon className="size-4" aria-hidden="true"/>}
          iconPlacement={"left"}
        >
          <span className="sr-only">删除文件</span>
        </Button>
      </div>
    </div>
  )
}

function isFileWithPreview(file: File): file is File & { preview: string } {
  return "preview" in file && typeof file.preview === "string"
}

interface FilePreviewProps {
  file: File & { preview: string }
}

function FilePreview({file}: FilePreviewProps) {
  if (file.type.startsWith("image/")) {
    return (
      <img
        src={file.preview}
        alt={file.name}
        width={48}
        height={48}
        loading="lazy"
        className="aspect-square shrink-0 rounded-md object-cover"
      />
    )
  }

  return (
    <FileTextIcon
      className="size-10 text-muted-foreground"
      aria-hidden="true"
    />
  )
}

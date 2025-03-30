import React, {useCallback, useEffect, useRef} from "react"
import {FileRequestParam, HttpException, uploadFile} from "@/constant/api";
import ConcurrencyTask from "@/lib/concurrency-task.ts";
import {useMap} from "ahooks";
import {isEmpty} from "radash";
import {toast} from "sonner";

export type FileUploadStatus<T> = File & {

  /**
   * 上传进度
   */
  progress: number

  /**
   * 失败消息
   */
  failMsg?: string

  /**
   * 状态
   */
  status: "not-started" | "uploading" | "success" | "failed"

  /**
   * 响应
   */
  response?: T
}

export type FileFailMsg = Record<string, { message: string }>

export type UploadFileOptions<T> = Omit<FileRequestParam<T>, "body" | "uploadProgress"> & {

  /**
   * 额外的主体参数
   */
  body?: Record<string, string | undefined | null>

  /**
   * 请求地址
   */
  uri: string

  /**
   * 文件上传最大并发数
   */
  maxConcurrency?: number
}


/**
 * 文件上传
 */
export function useUploadFile<T>(
  {
    maxConcurrency = 1,
    uri,
    body = {},
    ...options
  }: UploadFileOptions<T>) {
  const [isUploading, setIsUploading] = React.useState(false)
  const [fileUploadStatusMap, {set, reset,}] = useMap<string, FileUploadStatus<T>>();
  const mapRef = useRef<Map<string, FileUploadStatus<T>>>();

  useEffect(() => {
    mapRef.current = fileUploadStatusMap
  }, [fileUploadStatusMap]);

  /**
   * 上传处理文件
   */
  const onUpload = useCallback((files: File[]): Promise<Map<string, FileUploadStatus<T>>> => {
    if (isUploading) {
      throw new Error("请等待上一个任务完成！")
    }

    reset()
    return new Promise<Map<string, FileUploadStatus<T>>>((resolve, reject) => {
      let failMsg: FileFailMsg = {}

      setIsUploading(true)
      const concurrencyTask = new ConcurrencyTask(maxConcurrency,
        () => {
          setTimeout(() => {
            if (isEmpty(failMsg)) {
              resolve(mapRef.current || new Map<string, FileUploadStatus<T>>())
            } else {
              reject(failMsg)
            }
            setIsUploading(false)
          }, 50)
        });

      // 循环上传文件
      for (let file of files) {
        set(file.name, {
          ...file,
          status: "not-started",
          progress: 0,
        })

        concurrencyTask.addTask(
          async (taskResolve, taskReject) => {
            try {
              const response = await uploadFile<T>(uri, {
                ...options,
                body: {
                  ...body,
                  file
                },
                uploadProgress: (percent) => {
                  set(file.name, {
                    ...file,
                    status: "uploading",
                    progress: percent,
                  })
                }
              });

              set(file.name, {
                ...file,
                status: "success",
                progress: 100,
                response
              })

              taskResolve()
            } catch (e: any) {
              let message = e.message || "未知的错误！"
              if (e instanceof HttpException) {
                message = e.body.message
              }

              set(file.name, {
                ...file,
                status: "failed",
                failMsg: message,
                progress: 0
              })

              taskReject({message})

              failMsg[file.name] = {message}
            }
          })
      }

      concurrencyTask.run(false)
    })
  }, [options]);

  const onToastUpload = useCallback((files: File[]): Promise<Array<T>> => {
    return new Promise<Array<T>>((resolve, reject) => {
      toast.promise(
        onUpload(files!),
        {
          loading: "文件上传中....",
          success: (result) => {
            resolve(Array.from(result.values()).map(it => it.response!))
            return "文件上传完成"
          },
          error: (e) => {
            console.error(e)
            reject()
            return "部分文件上传失败，请检查！"
          },
          finally: () => {
            reject()
          }
        }
      )
    })
  }, [onUpload]);

  return {
    onUpload,
    onToastUpload,
    fileUploadStatusMap,
    isUploading,
  }
}

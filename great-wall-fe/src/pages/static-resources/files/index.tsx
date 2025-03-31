import {DataTable} from "@/components/custom-ui/data-table/data-table.tsx";
import {columns} from "./columns.tsx";
import {ArrowLeft, ArrowRight, ArrowUp, FileUp, FolderPlus, House, RefreshCcw} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {IconType} from "@/components/types.tsx";
import {Fragment, ReactNode, SyntheticEvent, useEffect, useRef} from "react";
import {Tooltip, TooltipContent, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Button} from "@/components/ui/button.tsx";
import useApiRequest from "@/components/hooks/use-api-request.ts";
import {staticResourcesDeleteFile, staticResourcesFileList} from "@/constant/api/static-resources";
import {useParams} from "react-router-dom";
import {isNumber} from "lodash";
import {FileUploaderDialog, FileUploaderDialogInstance} from "@/pages/static-resources/files/file-uploader-dialog.tsx";
import {CreateDirDialog, CreateDirDialogInstance} from "@/pages/static-resources/files/create-dir-dialog.tsx";
import {useHistoryTravel, useUpdateEffect} from "ahooks";
import {useGetFileDir, useNavigateFileDir} from "@/pages/static-resources/files/use-navigate-file-dir.ts";
import {toast} from "sonner";
import {downloadFile} from "@/lib/utils.ts";

/**
 * 静态资源列表
 * @constructor
 */
export default function StaticResourcesFiles() {
  const {id} = useParams();
  if (!id && !isNumber(id)) {
    throw new Error(`静态资源id必须存在！`)
  }

  const navigateFileDir = useNavigateFileDir();
  const fileUploaderDialogRef = useRef<FileUploaderDialogInstance>(null);
  const createDirDialogRef = useRef<CreateDirDialogInstance>(null);
  const parentDir = useGetFileDir()

  const {
    data,
    run,
    loading,
    refresh
  } = useApiRequest(staticResourcesFileList, {manual: true});

  useEffect(() => run(Number(id), parentDir), [parentDir]);

  const {
    runAsync: deleteFileRunAsync
  } = useApiRequest(staticResourcesDeleteFile, {manual: true});

  /**
   * 删除文件
   */
  async function handleDelete(paths: string[]) {
    await toast.promise(
      async () => {
        for (let path of paths) {
          await deleteFileRunAsync(Number(id), path)
        }
      },
      {
        loading: "正在删除文件...",
        success: "文件删除成功...",
        error: "文件删除失败...",
        finally: () => {
          refresh()
        }
      }).unwrap()
  }

  return (
    <div className={"w-full h-full flex flex-col gap-4"}>
      <Nav onRefresh={refresh}/>
      <DataTable
        data={data?.records || []}
        loading={loading}
        searchColumnId={"name"}
        manual={false}
        columns={columns({
          event: {
            onDelete: async ({row}) => {
              const {relativePath} = row.original;
              await handleDelete([relativePath])
            },
            onDownload: ({row}) => {
              const {name, relativePath} = row.original;
              downloadFile(name, `/api/static-resources/${id}/files/download?relativePath=${relativePath}`)
            },
            onOpenDir: ({row}) => {
              navigateFileDir(row.original.relativePath)
            }
          }
        })}
        plusOptions={[
          {
            label: "创建文件夹",
            icon: FolderPlus,
            onClick: () => createDirDialogRef.current?.onShow(),
          },
          {
            label: "上传文件",
            icon: FileUp,
            onClick: () => fileUploaderDialogRef.current?.onShow(),
          }
        ]}
        onDelete={async (rows) => {
          await handleDelete(rows.map(it => it.original.relativePath))
        }}
      />
      <FileUploaderDialog
        ref={fileUploaderDialogRef}
        id={Number(id)}
        parentDir={parentDir}
        onConfirm={async () => {
          refresh()
        }}
      />
      <CreateDirDialog
        ref={createDirDialogRef}
        id={Number(id)}
        parentDir={parentDir}
        onConfirm={async () => {
          refresh()
        }}
      />
    </div>
  )
}

type NavProps = {
  onRefresh?: () => Promise<void> | void
}

function Nav(
  {
    onRefresh
  }: NavProps) {
  const navigateFileDir = useNavigateFileDir();
  const fileDir = useGetFileDir()

  const {value, setValue, back, forward, backLength, forwardLength} = useHistoryTravel<string>("", 50);

  useUpdateEffect(() => {
    if (value !== fileDir) {
      setValue(fileDir)
    }
  }, [fileDir]);

  useUpdateEffect(() => {
    if (value !== fileDir) {
      navigateFileDir(value || "")
    }
  }, [value]);

  return (
    <div className={"flex flex-row gap-3 items-center"}>
      <IconBut
        Icon={ArrowLeft}
        tooltip={"上一步"}
        onClick={back}
        disabled={backLength <= 0}
      />
      <IconBut
        Icon={ArrowRight}
        tooltip={"下一步"}
        onClick={forward}
        disabled={forwardLength <= 0}
      />
      <IconBut
        Icon={ArrowUp}
        tooltip={"上一级"}
        onClick={() => {
          navigateFileDir(fileDir.substring(0, fileDir.lastIndexOf("/")))
        }}
        disabled={fileDir === ""}
      />
      <IconBut
        Icon={RefreshCcw}
        tooltip={"刷新"}
        onClick={onRefresh}
      />

      <div className={"flex-auto border py-2 px-3 rounded-md"}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="#parentDir=">
                <House className={"size-5"}/>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator/>
            {splitAndIncludePrevious(value || "").map((it, index) => (
              <Fragment key={index}>
                {index > 0 && (<BreadcrumbSeparator/>)}
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <div
                      className={"cursor-pointer"}
                      onClick={() => (navigateFileDir(it))}
                    >
                      {it.split("/").pop()}
                    </div>
                  </BreadcrumbLink>
                </BreadcrumbItem>
              </Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}

/**
 * 将字符串按 '/' 分割，并确保每一段包含前一段内容
 * @param input 输入字符串
 * @returns 处理后的字符串数组
 */
function splitAndIncludePrevious(input: string): string[] {
  input = decodeURIComponent(input)
  if (!input) return [];

  const segments = input.split('/').filter(segment => segment.length > 0);
  if (segments.length === 0) return [];

  const result: string[] = [segments[0]];
  for (let i = 1; i < segments.length; i++) {
    result.push(`${result[i - 1]}/${segments[i]}`);
  }

  return result;
}

type IconButProps = {
  Icon: IconType,
  tooltip: ReactNode
  onClick?: (e: SyntheticEvent<any>) => Promise<unknown> | unknown
  disabled?: boolean | undefined;
}

function IconBut(
  {
    Icon,
    tooltip,
    onClick,
    disabled
  }: IconButProps) {

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={"secondary"}
          size={"icon"}
          className={"size-9 rounded-full"}
          onClick={onClick}
          disabled={disabled}
        >
          <Icon className={"size-4"}/>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        {tooltip}
      </TooltipContent>
    </Tooltip>
  )
}
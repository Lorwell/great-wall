import {DataTable} from "@/components/custom-ui/data-table/data-table.tsx";
import {columns} from "./columns.tsx";
import {ArrowLeft, ArrowRight, FileUp, FolderPlus, House, RefreshCcw} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from "@/components/ui/breadcrumb.tsx";
import {IconType} from "@/components/types.tsx";
import {ReactNode, useEffect, useRef} from "react";
import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.tsx";
import {Button} from "@/components/ui/button.tsx";
import useApiRequest from "@/components/hooks/use-api-request.ts";
import {staticResourcesFileList} from "@/constant/api/static-resources";
import {useParams} from "react-router-dom";
import {isNumber} from "lodash";
import {FileUploaderDialog, FileUploaderDialogInstance} from "@/pages/static-resources/files/file-uploader-dialog.tsx";
import {CreateDirDialog, CreateDirDialogInstance} from "@/pages/static-resources/files/create-dir-dialog.tsx";

/**
 * 静态资源列表
 * @constructor
 */
export default function StaticResourcesFiles() {
  const {id} = useParams();
  if (!id && !isNumber(id)) {
    throw new Error(`静态资源id必须存在！`)
  }

  const fileUploaderDialogRef = useRef<FileUploaderDialogInstance>(null);
  const createDirDialogRef = useRef<CreateDirDialogInstance>(null);

  const {
    data,
    run,
    loading,
    refresh
  } = useApiRequest(staticResourcesFileList, {manual: true});

  useEffect(() => run(Number(id)), [id])

  return (
    <div className={"w-full h-full flex flex-col gap-4"}>
      <Nav/>
      <DataTable
        data={data?.records || []}
        loading={loading}
        columns={columns({
          event: {}
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
      />
      <FileUploaderDialog
        ref={fileUploaderDialogRef}
        id={Number(id)}
        parentDir={""}
        onConfirm={async () => {
          refresh()
        }}
      />
      <CreateDirDialog
        ref={createDirDialogRef}
        id={Number(id)}
        parentDir={""}
        onConfirm={async () => {
          refresh()
        }}
      />
    </div>
  )
}

function Nav() {
  return (
    <div className={"flex flex-row gap-3 items-center"}>
      <IconBut
        Icon={ArrowLeft}
        tooltip={"上一步"}
      />
      <IconBut
        Icon={ArrowRight}
        tooltip={"下一步"}
      />
      <IconBut
        Icon={RefreshCcw}
        tooltip={"刷新"}
      />

      <div className={"flex-auto border py-2 px-3 rounded-md"}>
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">
                <House className={"size-5"}/>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator/>
            <BreadcrumbItem>
              <BreadcrumbLink href="/components">Components</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator/>
            <BreadcrumbItem>
              <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
    </div>
  )
}

type IconButProps = {
  Icon: IconType,
  tooltip: ReactNode
}

function IconBut(
  {
    Icon,
    tooltip
  }: IconButProps) {

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button variant={"secondary"} size={"unstyled"} className={"rounded-full size-8 cursor-pointer"}>
            <Icon className={"size-4"}/>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  )
}
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card.tsx"
import {ScrollArea, ScrollBar} from "@/components/ui/scroll-area.tsx"
import {EmptyCard} from "@/components/custom-ui/file-uploader/empty-card.tsx"
import {type ClientUploadedFileData} from "uploadthing/types"

interface UploadedFilesCardProps {
  uploadedFiles: UploadedFile[]
}


export interface UploadedFile<T = unknown> extends ClientUploadedFileData<T> {
}


export function UploadedFilesCard({uploadedFiles}: UploadedFilesCardProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Uploaded files</CardTitle>
        <CardDescription>View the uploaded files here</CardDescription>
      </CardHeader>
      <CardContent>
        {uploadedFiles.length > 0 ? (
          <ScrollArea className="pb-4">
            <div className="flex w-max space-x-2.5">
              {uploadedFiles.map((file) => (
                <div key={file.key} className="relative aspect-video w-64">
                  <img
                    src={file.url}
                    alt={file.name}
                    sizes="(min-width: 640px) 640px, 100vw"
                    loading="lazy"
                    className="rounded-md object-cover"
                  />
                </div>
              ))}
            </div>
            <ScrollBar orientation="horizontal"/>
          </ScrollArea>
        ) : (
          <EmptyCard
            title="No files uploaded"
            description="Upload some files to see them here"
            className="w-full"
          />
        )}
      </CardContent>
    </Card>
  )
}

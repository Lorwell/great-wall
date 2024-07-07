import {ReactNode} from "react";
import {Separator} from "@/components/ui/separator.tsx";

/**
 * 标签文件
 * @constructor
 */
export default function LabelText({label, value, separator = true}: {
  label: string | ReactNode,
  value: string | ReactNode,
  separator?: boolean
}) {
  return (
    <div className={"w-full flex flex-col"}>
      <div className="flex flex-row">
        <div className="w-[300px] text-base font-medium">{label}</div>
        <div className="text-sm text-muted-foreground flex-auto">
          {value}
        </div>
      </div>
      {separator && <Separator className="my-4"/>}
    </div>
  )
}
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useParams} from "react-router-dom";
import {useId, useState} from "react";
import {LogTypeEnum} from "@/constant/api/app-logs/types.ts";
import {toast} from "sonner";
import {isBlank} from "@/utils/Utils.ts";
import {Input} from "@/components/ui/input.tsx";
import {Label} from "@/components/ui/label.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import {Button} from "@/components/ui/button.tsx";

/**
 * 日志文件
 * @constructor
 */
export default function LogFile() {
  const {type, file} = useParams();

  if (isBlank(type) || isBlank(file)) {
    toast.error("错误的路径参数", {
      position: "top-right",
      duration: 3000
    })
    window.history.back()
  }

  const logBodyId = useId();

  const [logType, setLogType] = useState<LogTypeEnum>(type!!.toUpperCase() as LogTypeEnum)


  return (
    <div className={"w-full h-full flex flex-col space-y-2"}>

      <div>
        <Select value={logType} onValueChange={it => setLogType(it as LogTypeEnum)}>
          <SelectTrigger className="w-[150px]">
            <SelectValue/>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ROOT">系统日志</SelectItem>
            <SelectItem value="ACCESS">访问日志</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div id={logBodyId}>

      </div>

      <div className={"flex flex-row justify-between"}>
        <div className={"flex flex-row items-center space-x-4"}>
          <div className={"flex flex-row items-center space-x-2"}>
            <Label htmlFor="rowsLimit">日志文件行数限制:</Label>
            <Input id={"rowsLimit"} type={"number"} className={"w-24"}/>
          </div>
          <div className={"flex flex-row items-center space-x-2"}>
            <Label htmlFor="pageSize">每页行数:</Label>
            <Input id={"pageSize"} type={"number"} className={"w-24"}/>
          </div>
        </div>

        <div className={"flex flex-row items-center space-x-4"}>
          <div className={"flex flex-row items-center space-x-1"}>
            <Checkbox id={"autoRefresh"}/>
            <Label htmlFor="autoRefresh">自动刷新</Label>
          </div>
          <div className={"flex flex-row items-center space-x-2"}>
            <Label htmlFor="refreshInterval">自动刷新间隔:</Label>
            <Input id={"refreshInterval"} type={"number"} className={"w-24"}/>
          </div>
          <div className={"flex flex-row items-center space-x-2"}>
            <Button variant={"secondary"}>下一页</Button>
          </div>
        </div>

      </div>
    </div>
  )
}
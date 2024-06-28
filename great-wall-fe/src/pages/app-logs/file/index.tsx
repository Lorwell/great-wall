import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select";
import {useParams} from "react-router-dom";
import {CSSProperties, useEffect, useRef, useState} from "react";
import {LogTypeEnum} from "@/constant/api/app-logs/types.ts";
import {toast} from "sonner";
import {isBlank} from "@/utils/Utils.ts";
import {Label} from "@/components/ui/label.tsx";
import {Checkbox} from "@/components/ui/checkbox.tsx";
import AutoSizablePanel from "@/components/custom-ui/auto-sizable-panel.tsx";

import {Dot} from "lucide-react";
import {LazyLog, ScrollFollow} from "@melloware/react-logviewer";

export enum ReadyState {
  Connecting = "CONNECTING",
  Open = "OPEN",
  Closed = "CLOSED"
}

const statusStyles: Record<string, CSSProperties> = {
  open: {
    color: "rgba(74, 167, 133, 1)"
  },
  connecting: {
    color: "rgba(89, 168, 212, 1)"
  },
  closed: {
    color: "rgba(255, 71, 71, 1)"
  }
}

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

  const [logType, setLogType] = useState<LogTypeEnum>(type!!.toUpperCase() as LogTypeEnum)

  // 操作相关
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // websocket 相关
  const wsRef = useRef<WebSocket | null>(null);
  const [readyState, setReadyState] = useState<ReadyState>(ReadyState.Connecting);

  // 刷新
  useEffect(() => {
    wsRef.current?.send(JSON.stringify({autoRefresh}))
  }, [autoRefresh]);

  const host = `${window.location.host}`;
  const openTLS = 'https:' === window.location.protocol;
  const url = `${openTLS ? 'wss' : 'ws'}://${host}/api/logs/type/${type}/name/${file}`

  return (
    <AutoSizablePanel className={"w-full h-full overflow-hidden"}>
      {
        (size) => (
          <div className={"flex flex-col space-y-4"} style={{...size}}>

            <div className={"flex flex-row justify-between"}>
              <div className={"flex flex-row items-center space-x-2"}>
                <Select value={logType} onValueChange={it => setLogType(it as LogTypeEnum)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROOT">系统日志</SelectItem>
                    <SelectItem value="ACCESS">访问日志</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={logType} onValueChange={it => setLogType(it as LogTypeEnum)}>
                  <SelectTrigger className="w-[150px]">
                    <SelectValue/>
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ROOT">系统日志</SelectItem>
                    <SelectItem value="ACCESS">访问日志</SelectItem>
                  </SelectContent>
                </Select>

                <div className={"flex flex-row items-center space-x-1"}>
                  <Checkbox id={"autoRefresh"}
                            checked={autoRefresh}
                            onCheckedChange={(value) => setAutoRefresh(typeof value === "boolean" ? value : false)}
                  />
                  <Label htmlFor="autoRefresh">自动追踪日志</Label>
                </div>
              </div>

              <div className={"flex flex-row items-center space-x-2"}>

                <div className={"flex flex-row items-center space-x-2"}>
                  <Dot className={"rounded"} style={{...statusStyles[readyState.toLowerCase()]}}/>
                  <span style={{...statusStyles[readyState.toLowerCase()]}}>
                    {readyState === ReadyState.Connecting && "连接中"}
                    {readyState === ReadyState.Open && "已连接"}
                    {readyState === ReadyState.Closed && "断开"}
                  </span>
                </div>

              </div>
            </div>

            <div className={"flex-auto"}>
              <ScrollFollow
                startFollowing={true}
                render={({follow, onScroll}) => (
                  <LazyLog follow={follow}
                           onScroll={onScroll}
                           caseInsensitive
                           enableHotKeys
                           enableLinks
                           enableMultilineHighlight
                           enableSearch
                           enableSearchNavigation
                           selectableLines
                           url={url}
                           websocket
                           websocketOptions={{
                             onOpen: (__, sock) => {
                               setReadyState(ReadyState.Open)
                               wsRef.current = sock
                               sock.send(JSON.stringify({autoRefresh}))
                             },
                             onClose: (e) => {
                               console.error(`日志链接 ${url} 断开`, e)
                               setReadyState(ReadyState.Closed)
                             },
                             // @ts-ignore
                             formatMessage: (message: string) => {
                               if (message === "PING") {
                                 wsRef.current?.send("PONG")
                                 return null
                               } else {
                                 return message
                               }
                             }
                           }}
                  />
                )}
              />
            </div>

          </div>
        )
      }
    </AutoSizablePanel>
  )
}

export interface LogFilePageOutput {

  /**
   * 是否已经达到尾行
   */
  lastLine: boolean

  /**
   * 实际行数
   */
  lineNumber: number

  /**
   * 行数据
   */
  lineData: string[]

}
